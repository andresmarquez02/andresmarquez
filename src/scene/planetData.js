// The two planets of the flight. Pure data, no three.js.
//
// `z` is where the ship passes closest (world z along the route), `dx`/`dy`
// the offset from the flight line. On desktop the camera's lens shift puts the
// whole flight in the right-hand column of the screen, so the planets pass
// above (solis) and below (cobalt) the ship instead of beside it: they stay in
// that column and leave the frame through its top or bottom edge. `reach` is
// how far (world units) the planet's pull on the ship and camera is felt.
export const PLANETS = [
  { id: "solis", z: -62, dx: 2, dy: 8, radius: 3.6, kind: "gas", ring: true, reach: 34 },
  { id: "cobalt", z: -182, dx: 2.5, dy: -8, radius: 4.2, kind: "giant", ring: false, reach: 38 },
];
