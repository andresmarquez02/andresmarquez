import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SECTION_IDS, routePosition, nearStation, pickTier, mulberry32,
  sampleLuminance, constellationLayout, fibonacciSphere,
} from "../src/scene/math.js";
import { bell, flybys, normalizeSpeed, fovFor, streakAlpha, streakLength, plumeLength } from "../src/scene/flight.js";
import { PLANETS } from "../src/scene/planetData.js";
import { cruiseOffset } from "../src/scene/route.js";
import { ROUTE, STATIONS, SEGMENT_LENGTH, stationU, aheadU, shipLead, zAt, uAtZ } from "../src/scene/route.js";

const sections = (values) => Object.fromEntries(SECTION_IDS.map((id, i) => [id, values[i] ?? 0]));

test("routePosition moves continuously with the scroll, never parking", () => {
  assert.equal(routePosition(sections([])), 0);
  assert.equal(routePosition(sections([0.5])), 0.5); // already flying inside the hero
  assert.equal(routePosition(sections([1, 0.25])), 1.25);
  assert.equal(routePosition(sections([1, 1, 1, 1, 1, 0.7])), 5); // contact adds nothing: the route ends there
  let last = -1;
  for (let p = 0; p <= 1; p += 0.05) {
    const r = routePosition(sections([1, 1, p]));
    assert.ok(r > last, "strictly increasing while scrolling down");
    last = r;
  }
});

test("nearStation hides pieces more than a station away", () => {
  assert.ok(nearStation(0, "hero"));
  assert.ok(!nearStation(1, "automation"));
  assert.ok(nearStation(2.5, "stack"));
  assert.ok(!nearStation(4.5, "process"));
});

test("pickTier", () => {
  const base = { webgl: true, reducedMotion: false, coarsePointer: false, cores: 8, width: 1440 };
  assert.equal(pickTier(base), "high");
  assert.equal(pickTier({ ...base, webgl: false }), "off");
  assert.equal(pickTier({ ...base, reducedMotion: true }), "off");
  assert.equal(pickTier({ ...base, coarsePointer: true }), "low");
  assert.equal(pickTier({ ...base, cores: 4 }), "low");
  assert.equal(pickTier({ ...base, width: 767 }), "low");
});

test("mulberry32 is deterministic", () => {
  const a = mulberry32(7);
  const b = mulberry32(7);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});

test("sampleLuminance only picks bright pixels", () => {
  const w = 4;
  const h = 4;
  const data = new Uint8ClampedArray(w * h * 4);
  data.set([255, 255, 255, 255], (1 * w + 2) * 4); // pixel (2, 1)
  const pts = sampleLuminance(data, w, h, 50, { height: 4, rng: mulberry32(1) });
  assert.equal(pts.length, 150);
  for (let n = 0; n < 50; n++) {
    assert.ok(pts[n * 3] >= 0 && pts[n * 3] <= 1, `x in pixel column 2 (got ${pts[n * 3]})`);
    assert.ok(pts[n * 3 + 1] >= 0 && pts[n * 3 + 1] <= 1, `y in pixel row 1 (got ${pts[n * 3 + 1]})`);
  }
});

test("sampleLuminance survives a black image", () => {
  const pts = sampleLuminance(new Uint8ClampedArray(4 * 4 * 4), 4, 4, 10);
  assert.equal(pts.length, 30);
  assert.ok(pts.every((v) => v === 0));
});

test("constellationLayout draws one polyline per group", () => {
  const { stars, segments } = constellationLayout([3, 1, 4], mulberry32(5));
  assert.equal(stars.length, 8);
  assert.equal(segments.length, 2 + 0 + 3);
  for (const [a, b] of segments) assert.equal(stars[a].group, stars[b].group);
});

test("the route passes through every station, with segment lengths matching the table", () => {
  STATIONS.forEach((station, i) => {
    assert.ok(ROUTE.getPoint(stationU(SECTION_IDS[i])).distanceTo(station) < 1e-6, `station ${SECTION_IDS[i]}`);
  });
  SEGMENT_LENGTH.forEach((length, i) => {
    assert.equal(Math.round(STATIONS[i].z - STATIONS[i + 1].z), length);
  });
});

test("aheadU and shipLead", () => {
  assert.ok(aheadU(0.1, 10) > 0.1);
  assert.ok(aheadU(0.99, 100) <= 1);
  assert.equal(shipLead(0), 0);
  assert.equal(shipLead(5), 0);
  assert.ok(shipLead(2.5) > 9);
});

test("uAtZ inverts zAt", () => {
  for (const u of [0, 0.13, 0.5, 0.77, 1]) assert.ok(Math.abs(uAtZ(zAt(u)) - u) < 1e-6);
});

test("two planets, clear of the ship's path and of each other", () => {
  assert.equal(PLANETS.length, 2);
  const ship = cruiseOffset(2).x; // where the ship flies on wide screens
  let previous = zAt(0);
  for (const p of PLANETS) {
    assert.ok(p.z < previous && p.z > zAt(1), `${p.id} out of order or off the route`);
    assert.ok(p.radius >= 3 && p.radius <= 4.5, `${p.id}: big but under a quarter of the screen`);
    assert.ok(p.dx - p.radius >= ship + 3, `${p.id} would clip the ship`);
    if (p.ring) assert.ok(p.dx - p.radius * 1.75 >= ship + 1, `${p.id}'s ring would cross the ship`);
    assert.ok(p.reach >= 20 && p.reach <= 45);
    previous = p.z;
  }
  assert.ok(PLANETS[0].z - PLANETS[1].z >= 60, "planets far apart: one at a time");
});

test("fibonacciSphere spreads unit vectors evenly over the sphere", () => {
  const v = fibonacciSphere(2000);
  let sumY = 0;
  let north = 0;
  for (let i = 0; i < 2000; i++) {
    const len = Math.hypot(v[i * 3], v[i * 3 + 1], v[i * 3 + 2]);
    assert.ok(Math.abs(len - 1) < 1e-5);
    sumY += v[i * 3 + 1];
    if (v[i * 3 + 1] > 0.5) north++;
  }
  assert.ok(Math.abs(sumY) < 1, "centred");
  assert.ok(Math.abs(north / 2000 - 0.25) < 0.01, "a quarter of the sphere lies above y = 0.5");
});

test("flybys: quiet far from planets, banking away from the planet when close", () => {
  const far = flybys(0, [{ z: -100, dx: 8, reach: 20 }]);
  assert.deepEqual(far, { bank: 0, swerve: 0, look: 0 });

  const rightPlanet = flybys(-100, [{ z: -100, dx: 8, reach: 20 }]);
  assert.ok(rightPlanet.bank > 0 && rightPlanet.swerve < 0 && rightPlanet.look > 0);
  const leftPlanet = flybys(-100, [{ z: -100, dx: -8, reach: 20 }]);
  assert.ok(leftPlanet.bank < 0 && leftPlanet.swerve > 0 && leftPlanet.look < 0);
  assert.ok(Math.abs(rightPlanet.bank + leftPlanet.bank) < 1e-12, "mirror image");

  const crowded = flybys(-100, Array.from({ length: 6 }, () => ({ z: -100, dx: 8, reach: 20 })));
  assert.ok(crowded.bank <= 0.6 && crowded.swerve >= -2 && crowded.look <= 1.5, "stays bounded");
  assert.ok(bell(0, 0.1) === 1 && bell(0.1, 0.1) === 0 && bell(0.05, 0.1) === bell(-0.05, 0.1));
});

test("speed effects are subtle and bounded", () => {
  assert.equal(normalizeSpeed(0), 0);
  assert.equal(normalizeSpeed(1e6), 1);
  assert.equal(fovFor(0), 45);
  assert.equal(fovFor(5), 52);
  assert.equal(streakAlpha(0), 0);
  assert.ok(Math.abs(streakAlpha(1) - 0.3) < 1e-12 && streakAlpha(9) === streakAlpha(1));
  assert.ok(streakLength(1) <= 3.6 && plumeLength(1) <= 3);
  assert.ok(streakAlpha(0.5) < streakAlpha(0.8), "grows with speed");
});
