import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import { journey } from "./journey";
import { streakAlpha, streakLength } from "./flight";
import { mulberry32 } from "./math";

const DEPTH = 140; // how far ahead of the camera streaks live before wrapping

const vertexShader = /* glsl */ `
  uniform vec3 uCam;
  uniform float uLen;
  uniform float uAlpha;
  uniform float uDepth;
  attribute vec3 aBase;
  attribute float aEnd;
  varying float vAlpha;

  void main() {
    // streaks are fixed in the world; the wrap keeps them in a tube ahead of the camera
    float zRel = mod(aBase.z - uCam.z, uDepth) - uDepth;
    vec3 p = vec3(uCam.x + aBase.x, uCam.y + aBase.y, uCam.z + zRel + aEnd * uLen);
    float near = smoothstep(2.0, 10.0, -zRel);
    float far = 1.0 - smoothstep(uDepth * 0.7, uDepth, -zRel);
    vAlpha = uAlpha * near * far * (1.0 - 0.8 * aEnd);
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(0.62, 0.74, 1.0, vAlpha);
    #include <colorspace_fragment>
  }
`;

// Faint speed lines that only show while the reader scrolls fast. Deliberately
// subtle: they hint at speed, they never take over the frame.
export default function Streaks({ count }) {
  const ref = useRef(null);
  const geometry = useMemo(() => {
    const rng = mulberry32(21);
    const base = new Float32Array(count * 2 * 3);
    const end = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = 3.5 + rng() * 13;
      const z = rng() * DEPTH;
      for (let k = 0; k < 2; k++) {
        base.set([Math.cos(angle) * radius, Math.sin(angle) * radius, z], (i * 2 + k) * 3);
        end[i * 2 + k] = k;
      }
    }
    return { base, end };
  }, [count]);
  const uniforms = useMemo(
    () => ({ uCam: { value: [0, 0, 0] }, uLen: { value: 0 }, uAlpha: { value: 0 }, uDepth: { value: DEPTH } }),
    []
  );

  useFrame(({ camera }) => {
    const lines = ref.current;
    const alpha = streakAlpha(journey.speed);
    lines.visible = alpha > 0.003;
    if (!lines.visible) return;
    const live = lines.material.uniforms;
    live.uCam.value.x = camera.position.x;
    live.uCam.value.y = camera.position.y;
    live.uCam.value.z = camera.position.z;
    live.uLen.value = streakLength(journey.speed);
    live.uAlpha.value = alpha;
  });

  return (
    <lineSegments ref={ref} frustumCulled={false} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(count * 2 * 3), 3]} />
        <bufferAttribute attach="attributes-aBase" args={[geometry.base, 3]} />
        <bufferAttribute attach="attributes-aEnd" args={[geometry.end, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </lineSegments>
  );
}
