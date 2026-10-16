// Flight director: pure functions that turn the ship's place on the route and
// the scroll speed into the cinematic bits (banking, swerving, camera glance,
// field of view, speed streaks). No three.js, so it runs under `node --test`.
import { clamp, clamp01, smoothstep } from "./math.js";

// 1 at the closest approach, easing to 0 `width` away.
export function bell(distance, width) {
  const t = 1 - clamp01(Math.abs(distance) / width);
  return t * t * (3 - 2 * t);
}

// What passing planets do at world position `z`. Planets pass above or below
// the flight line (inside the right-hand column of the screen), so the ship
// ducks away from them (`dip`), rolls a little away from their side (`bank`),
// nudges sideways (`swerve`) and the camera glances up or down at them (`look`).
// Positive bank = banking left (top of the ship leans toward -x).
export function flybys(z, planets) {
  let bank = 0;
  let swerve = 0;
  let dip = 0;
  let look = 0;
  for (const planet of planets) {
    const w = bell(z - planet.z, planet.reach);
    const side = Math.sign(planet.dx);
    const above = Math.sign(planet.dy);
    bank += side * w * 0.35;
    swerve -= side * w * 0.5;
    dip -= above * w * 1.2;
    look += above * w * 0.8;
  }
  return {
    bank: clamp(bank, -0.5, 0.5),
    swerve: clamp(swerve, -0.8, 0.8),
    dip: clamp(dip, -1.5, 1.5),
    look: clamp(look, -1, 1),
  };
}

// Which way the ship faces: 1 = forward (scrolling down), -1 = flying back
// (scrolling up). Rockets have no reverse gear, so instead of backing up the
// ship turns around. Jitter below `threshold` (world units per second) keeps
// the current heading.
export const HEADING_THRESHOLD = 2;
export function nextHeading(current, velocity, threshold = HEADING_THRESHOLD) {
  if (velocity > threshold) return 1;
  if (velocity < -threshold) return -1;
  return current;
}

// `speed` is the camera's world speed normalised to 0..1.
export const SPEED_REFERENCE = 60; // world units per second that count as "full speed"
export const normalizeSpeed = (unitsPerSecond) => clamp01(unitsPerSecond / SPEED_REFERENCE);

export const fovFor = (speed) => 45 + 7 * clamp01(speed);
export const streakAlpha = (speed) => 0.3 * smoothstep(0.12, 0.9, speed);
export const streakLength = (speed) => 0.4 + 3.2 * clamp01(speed);
export const plumeLength = (speed) => 1.4 + 1.6 * clamp01(speed);
