import { useEffect, useRef } from "react";
import * as THREE from "three";

THREE.ColorManagement.enabled = true;

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Mixing rule: uBase is the FLOOR. We never multiply below it; we only mix
// toward the color blobs. This guarantees that the darkest pixel in the hero
// equals the page background — no horizontal seam at the section boundary.
const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uBase;
  uniform vec3 uColorY;
  uniform vec3 uColorB;
  uniform vec3 uColorR;
  uniform float uIntensity;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz;
    x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;
    vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);
    vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }

  // Hash for star field — deterministic per cell, no texture needed.
  float hash21(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Soft horizontal band: 1.0 inside [center-half, center+half] with feathered edges.
  float band(float y, float center, float halfWidth, float feather){
    return smoothstep(center - halfWidth - feather, center - halfWidth + feather, y)
         - smoothstep(center + halfWidth - feather, center + halfWidth + feather, y);
  }

  void main(){
    vec2 uv = vUv;
    float t = uTime;

    // Flag-waving displacement: layered sine waves traveling along X plus a
    // slow noise drift. Amplitude grows toward the right edge so it reads as
    // fabric hoisted on the left, fluttering on the right.
    float anchor = smoothstep(0.0, 0.85, uv.x);
    float waveA = sin(uv.x * 7.5 - t * 1.4) * 0.04;
    float waveB = sin(uv.x * 14.0 - t * 2.2 + uv.y * 3.0) * 0.018;
    float drift = snoise(uv * 1.6 + vec2(t * 0.15, t * 0.10)) * 0.05;
    float wave = (waveA + waveB) * anchor + drift;
    float y = uv.y + wave;

    float feather = 0.16;
    float bY = band(y, 0.83, 0.17, feather);
    float bB = band(y, 0.50, 0.17, feather);
    float bR = band(y, 0.17, 0.17, feather);

    // Corner localization: flag only renders in the top-right area and
    // fades to nothing toward the center/left. Radial mask + noise dissolve
    // give it a "drifting fabric" feel instead of a literal flag.
    vec2 cornerAnchor = vec2(0.92, 0.28);
    float radial = smoothstep(0.65, 0.10, distance(uv, cornerAnchor));
    float dissolve = 0.55 + 0.45 * snoise(uv * 2.4 + vec2(t * 0.08, -t * 0.05));
    float cornerMask = radial * dissolve;

    // Subtle fabric shading where the wave dips vs lifts.
    float shade = 1.0 + wave * 1.8;

    vec3 col = uBase;
    col = mix(col, uColorY * shade, bY * 0.32 * uIntensity * cornerMask);
    col = mix(col, uColorB * shade, bB * 0.34 * uIntensity * cornerMask);
    col = mix(col, uColorR * shade, bR * 0.28 * uIntensity * cornerMask);

    // Tiny static star field. Cell size = ~1.4px on a 1080p canvas — points
    // are sub-pixel small and only the brightest ones above threshold draw.
    vec2 starUv = uv * uResolution / 1.4;
    vec2 cell = floor(starUv);
    vec2 f = fract(starUv) - 0.5;
    float h = hash21(cell);
    // Sparsity: only ~0.6% of cells contain a star.
    float isStar = step(0.994, h);
    // Twinkle: very slow, per-star phase.
    float twinkle = 0.55 + 0.45 * sin(uTime * 0.6 + h * 31.4);
    // Sub-pixel point: tight gaussian.
    float star = exp(-dot(f, f) * 60.0) * isStar * twinkle;
    col += vec3(star * 0.45);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function HeroBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Read the current page background from the CSS token so the shader's
    // floor color matches whatever theme is active.
    const readBg = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg")
        .trim();
      // --bg is an RGB triplet like "10 10 11".
      const [r, g, b] = raw.split(/\s+/).map((n) => Number(n) / 255);
      return new THREE.Color(r, g, b);
    };

    // Dark mode: flag bands stay barely-there so black dominates (recruiter-safe).
    // Light mode: full intensity so the tint actually reads against white bg.
    const readIntensity = () =>
      document.documentElement.classList.contains("dark") ? 0.55 : 1.0;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(readBg(), 1);
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
      // All colors as sRGB hex; Three.js converts to linear for the shader and
      // gamma-applies on output. With outputColorSpace = SRGBColorSpace this
      // guarantees the rendered base pixel equals the CSS body color exactly.
      uBase: { value: readBg() },
      uColorY: { value: new THREE.Color("#F5C518") },
      uColorB: { value: new THREE.Color("#1D4ED8") },
      uColorR: { value: new THREE.Color("#B91C1C") },
      uIntensity: { value: readIntensity() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Background is global/fixed — pause only when the tab is hidden.
    let isVisible = document.visibilityState === "visible";
    const handleVisibility = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let raf = 0;
    const start = performance.now();
    const render = () => {
      if (isVisible) {
        uniforms.uTime.value = (performance.now() - start) / 1000;
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Re-read --bg whenever the .dark class toggles on <html>.
    const themeObserver = new MutationObserver(() => {
      const next = readBg();
      uniforms.uBase.value.copy(next);
      uniforms.uIntensity.value = readIntensity();
      renderer.setClearColor(next, 1);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
