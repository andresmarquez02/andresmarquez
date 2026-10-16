// Flight director: pure functions that turn the ship's place on the route and
// the scroll speed into the cinematic bits (banking, swerving, camera glance,
// field of view, speed streaks). No three.js, so it runs under `node --test`.
import { clamp, clamp01, smoothstep } from "./math.js";

// 1 at the closest approach, easing to 0 `width` away.
export function bell(distance, width) {
  const t = 1 - clamp01(Math.abs(distance) / width);
  return t * t * (3 - 2 * t);
}

// What passing planets do at world position `z`: roll the ship into a turn
// away from the planet, push it sideways, and make the camera glance at it.
// Positive bank = banking left (top of the ship leans toward -x).
export function flybys(z, planets) {
  let bank = 0;
  let swerve = 0;
  let look = 0;
  for (const planet of planets) {
    const w = bell(z - planet.z, planet.reach);
    const side = Math.sign(planet.dx);
    bank += side * w * 0.5;
    swerve -= side * w * 1.4;
    look += side * w * 1.1;
  }
  return { bank: clamp(bank, -0.6, 0.6), swerve: clamp(swerve, -2, 2), look: clamp(look, -1.5, 1.5) };
}

// `speed` is the camera's world speed normalised to 0..1.
export const SPEED_REFERENCE = 60; // world units per second that count as "full speed"
export const normalizeSpeed = (unitsPerSecond) => clamp01(unitsPerSecond / SPEED_REFERENCE);

export const fovFor = (speed) => 45 + 7 * clamp01(speed);
export const streakAlpha = (speed) => 0.3 * smoothstep(0.12, 0.9, speed);
export const streakLength = (speed) => 0.4 + 3.2 * clamp01(speed);
export const plumeLength = (speed) => 1.4 + 1.6 * clamp01(speed);
