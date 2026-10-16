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

// The ship is always "climbing": its nose points up and to the right (ASCENT
// while the reader scrolls down) or straight up (LAUNCH while scrolling back
// up). It never turns around, so it reads as a rocket taking off, not a car
// turning. Directions in world space, nose first.
export const ASCENT_HEADING = [1, 0.55, 0.3];
export const LAUNCH_HEADING = [0.3, 1, 0.1];

// How fast the flight *feels*, 0..1: the real scroll speed, but never below a
// steady cruise between the launch (hero) and the landing (contact). Engines,
// speed lines and lens all follow this, so the ship looks fast the whole way.
export const CRUISE_FLOW = 0.6;
export function cruiseFlow(speed, r) {
  const cruising = CRUISE_FLOW * smoothstep(0.03, 0.4, r) * (1 - smoothstep(4.5, 4.95, r));
  return Math.max(clamp01(speed), cruising);
}

export const fovFor = (flow) => 45 + 7 * clamp01(flow);
export const streakAlpha = (flow) => 0.42 * smoothstep(0.1, 0.7, flow);
export const streakLength = (flow) => 0.8 + 3.4 * clamp01(flow);
// World units per second the speed lines slide past the ship.
export const streakRate = (flow) => 14 + 80 * clamp01(flow);
export const plumeLength = (flow) => 2 + 3.2 * clamp01(flow);
