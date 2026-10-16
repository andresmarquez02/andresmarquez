// The two planets of the flight. Pure data, no three.js.
//
// `z` is where the ship passes closest (world z along the route), `dx`/`dy`
// the offset from the flight line (right of it, away from the text column),
// `reach` how far (world units) the planet's pull on the ship and camera is
// felt. Two clear bodies instead of a crowded sky, sized so that even at the
// closest pass neither covers more than ~25% of a desktop screen (measured:
// 21% and 16% at 1440x900).
export const PLANETS = [
  { id: "solis", z: -62, dx: 11, dy: 1.2, radius: 3.6, kind: "gas", ring: true, reach: 34 },
  { id: "cobalt", z: -182, dx: 11, dy: -0.6, radius: 4.2, kind: "giant", ring: false, reach: 38 },
];
