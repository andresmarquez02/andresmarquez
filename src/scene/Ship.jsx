import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Matrix4, Quaternion, Vector3 } from "three";
import { journey } from "./journey";
import { flybys, plumeLength } from "./flight";
import { mulberry32, routePosition, sampleLuminance, SECTION_IDS, smoothstep } from "./math";
import { PLANETS } from "./planetData";
import { aheadU, cruiseOffset, ROUTE, shipLead, stageOffset, stageScale } from "./route";
import { glowPointFragment } from "./shaders";
import { buildHullParticles, buildHullParts, NOZZLE_RING, NOZZLE_Z } from "./shipGeometry";

const PORTRAIT_SRC = "/images/andres.jpg";
// Part of the photo that turns into particles (fractions of the image size):
// head and shoulders. Calibration knob: retune if the photo changes.
const PORTRAIT_CROP = { x: 0.18, y: 0.06, w: 0.64, h: 0.56 };
const PORTRAIT_SAMPLE_WIDTH = 160;
// The wall behind him reads ~0.22 luminance and his skin ~0.58: 0.3 keeps
// face, neck and pendant only. Calibration knob, measured on this photo.
const PORTRAIT_THRESHOLD = 0.3;
const SHIP_SCALE = 0.95;
const PORTRAIT_HEIGHT = 9 / SHIP_SCALE; // 9 world units once the ship scale applies
// Hero pose: nose up and to the right, like a launch. Calibration knob.
const HERO_HEADING = new Vector3(1, 0.55, 0.3).normalize();
const UP = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);
const POINT_SIZE = 34; // px at 1 world unit, before device pixel ratio

const hullVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  attribute vec3 aColor;
  attribute vec3 aPortrait;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // per-point delay so the morph ripples instead of moving as one block
    float m = smoothstep(aSeed * 0.4, aSeed * 0.4 + 0.6, uMorph);
    vec3 p = mix(position, aPortrait, m);
    p += 0.03 * (1.0 + 3.0 * m) * vec3(sin(uTime * 2.0 + aSeed * 40.0), cos(uTime * 1.7 + aSeed * 31.0), sin(uTime * 1.3 + aSeed * 17.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.7 + 0.6 * fract(aSeed * 91.7)) * mix(1.0, 0.7, m) / -mv.z;
    vColor = mix(aColor, vec3(1.0, 0.93, 0.8), m * 0.5);
    // only ~45% of the particles draw the portrait: more saturates the face into a blob
    vAlpha = mix(1.0, step(aSeed, 0.45), m);
  }
`;

// Exhaust of the three engines: short, soft and fading, a touch longer when scrolling fast.
const plumeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uLen;
  uniform float uAlpha;
  uniform float uSize;
  attribute float aSeed;
  attribute vec2 aNozzle;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float t = fract(aSeed * 7.13 + uTime * 0.9); // 0 at the nozzle, 1 at the tail
    float angle = aSeed * 81.7;
    float spread = (0.05 + t * 0.22) * fract(aSeed * 3.7);
    vec3 p = vec3(aNozzle + vec2(cos(angle), sin(angle)) * spread, ${NOZZLE_Z.toFixed(2)} + t * uLen);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + 0.8 * fract(aSeed * 5.3)) * (1.0 - 0.5 * t) / -mv.z;
    vColor = mix(vec3(0.62, 0.78, 1.0), vec3(1.0, 0.6, 0.2), t);
    vAlpha = (1.0 - t) * (1.0 - t) * 0.5 * uAlpha;
  }
`;

// The protagonist: a launch vehicle made of glowing particles (amber nose
// fading to blue engines) that leads the camera along the route, banks away
// from the planets it passes, and turns into Andrés's portrait at contact.
export default function Ship({ hullParticles, plumeParticles }) {
  const group = useRef(null);
  const skin = useRef(null);
  const plume = useRef(null);
  const aspect = useThree((s) => s.viewport.aspect);
  const gl = useThree((s) => s.gl);

  const particles = useMemo(() => buildHullParticles(buildHullParts(), hullParticles), [hullParticles]);
  // Until the photo loads the "portrait" is the ship itself, so the morph is a no-op.
  const portrait = useMemo(() => new Float32Array(particles.position), [particles]);
  const nozzles = useMemo(() => {
    const seeds = new Float32Array(plumeParticles);
    const at = new Float32Array(plumeParticles * 2);
    const rng = mulberry32(5);
    for (let i = 0; i < plumeParticles; i++) {
      const a = Math.PI / 2 + (Math.floor(rng() * 3) * Math.PI * 2) / 3;
      seeds[i] = rng();
      at.set([Math.cos(a) * NOZZLE_RING, Math.sin(a) * NOZZLE_RING], i * 2);
    }
    return { seeds, at, origin: new Float32Array(plumeParticles * 3) };
  }, [plumeParticles]);

  const hullUniforms = useMemo(() => ({ uTime: { value: 0 }, uMorph: { value: 0 }, uSize: { value: POINT_SIZE } }), []);
  const plumeUniforms = useMemo(() => ({ uTime: { value: 0 }, uLen: { value: 1.4 }, uAlpha: { value: 1 }, uSize: { value: POINT_SIZE } }), []);
  const tmp = useMemo(
    () => ({
      pos: new Vector3(),
      stage: new Vector3(),
      tangent: new Vector3(),
      zero: new Vector3(),
      m: new Matrix4(),
      travel: new Quaternion(),
      hero: new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(new Vector3(), HERO_HEADING, UP)),
      identity: new Quaternion(),
      goal: new Quaternion(),
      roll: new Quaternion(),
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = PORTRAIT_SRC;
    img
      .decode()
      .then(() => {
        if (cancelled) return;
        const sx = img.naturalWidth * PORTRAIT_CROP.x;
        const sy = img.naturalHeight * PORTRAIT_CROP.y;
        const sw = img.naturalWidth * PORTRAIT_CROP.w;
        const sh = img.naturalHeight * PORTRAIT_CROP.h;
        const w = PORTRAIT_SAMPLE_WIDTH;
        const h = Math.round((w * sh) / sw);
        const canvas = Object.assign(document.createElement("canvas"), { width: w, height: h });
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
        const points = sampleLuminance(ctx.getImageData(0, 0, w, h).data, w, h, hullParticles, {
          threshold: PORTRAIT_THRESHOLD,
          height: PORTRAIT_HEIGHT,
          rng: mulberry32(7),
        });
        const attribute = skin.current.geometry.attributes.aPortrait;
        attribute.array.set(points);
        attribute.needsUpdate = true;
      })
      .catch(() => {
        // Photo missing or blocked: the ship simply stays a ship.
      });
    return () => {
      cancelled = true;
    };
  }, [hullParticles]);

  useFrame(({ clock }, delta) => {
    const ship = group.current;
    const r = routePosition(journey.section);
    const u = r / (SECTION_IDS.length - 1);
    const uShip = aheadU(u, shipLead(r));
    const heroWeight = 1 - smoothstep(0, 0.35, r);
    const morph = smoothstep(0.15, 0.55, journey.section.contact);

    ROUTE.getPoint(uShip, tmp.pos);
    const dodge = flybys(tmp.pos.z, PLANETS);
    tmp.pos.x += dodge.swerve * (1 - morph);
    tmp.pos.addScaledVector(cruiseOffset(aspect, tmp.stage), smoothstep(0.2, 1, r) * (1 - morph));
    tmp.pos.addScaledVector(stageOffset("hero", aspect, tmp.stage), heroWeight);
    tmp.pos.addScaledVector(stageOffset("contact", aspect, tmp.stage), morph);
    tmp.pos.y += Math.sin(clock.elapsedTime * 1.2) * 0.08;
    ship.position.lerp(tmp.pos, 1 - Math.exp(-6 * delta));

    // Matrix4.lookAt points -Z (the nose) along the route tangent.
    tmp.m.lookAt(tmp.zero, ROUTE.getTangent(uShip, tmp.tangent), UP);
    tmp.travel.setFromRotationMatrix(tmp.m);
    tmp.roll.setFromAxisAngle(Z_AXIS, dodge.bank * (1 - morph));
    tmp.goal.copy(tmp.travel).slerp(tmp.hero, heroWeight).slerp(tmp.identity, morph).multiply(tmp.roll);
    ship.quaternion.slerp(tmp.goal, 1 - Math.exp(-5 * delta));
    ship.scale.setScalar(SHIP_SCALE * stageScale(aspect));

    // R3F copies the `uniforms` props into the materials: write to the materials' own.
    const live = skin.current.material.uniforms;
    live.uTime.value = clock.elapsedTime;
    live.uMorph.value = morph;
    live.uSize.value = POINT_SIZE * gl.getPixelRatio();
    const exhaust = plume.current.material.uniforms;
    exhaust.uTime.value = clock.elapsedTime;
    exhaust.uLen.value = plumeLength(journey.speed);
    exhaust.uAlpha.value = 1 - morph;
    exhaust.uSize.value = POINT_SIZE * gl.getPixelRatio();
  });

  return (
    <group ref={group}>
      {/* renderOrder 4: always draw after the planets (renderOrder 1-3, NormalBlending). */}
      <points ref={skin} frustumCulled={false} renderOrder={4}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.position, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[particles.color, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[particles.seed, 1]} />
          <bufferAttribute attach="attributes-aPortrait" args={[portrait, 3]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={hullVertex}
          fragmentShader={glowPointFragment}
          uniforms={hullUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
      <points ref={plume} frustumCulled={false} renderOrder={4}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nozzles.origin, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[nozzles.seeds, 1]} />
          <bufferAttribute attach="attributes-aNozzle" args={[nozzles.at, 2]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={plumeVertex}
          fragmentShader={glowPointFragment}
          uniforms={plumeUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}
