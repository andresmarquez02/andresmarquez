import { pickTier } from "./math";

export const QUALITY = {
  high: { stars: 6000, hullParticles: 28000, plume: 900, streaks: 260, nebula: 350, planetPoints: 60000, ringPoints: 22000, bloom: true, post: true, maxDpr: 1.75 },
  low: { stars: 2500, hullParticles: 10000, plume: 350, streaks: 0, nebula: 180, planetPoints: 24000, ringPoints: 9000, bloom: false, post: false, maxDpr: 1.25 },
};

function hasWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function detectTier() {
  // QA override: ?tier=high|low|off forces a tier (e.g. to review the static page).
  const forced = new URLSearchParams(window.location.search).get("tier");
  if (forced === "off" || Object.hasOwn(QUALITY, forced)) return forced;
  return pickTier({
    webgl: hasWebGL2(),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    cores: navigator.hardwareConcurrency ?? 4,
    width: window.innerWidth,
  });
}
