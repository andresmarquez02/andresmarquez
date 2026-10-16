# Portafolio 3D "Cómo construyo software" — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el portafolio en un viaje 3D por scroll en el que un cohete de partículas vuela de forma continua, pasa cerca de dos planetas grandes y explica cómo Andrés construye software (patrones de diseño, escalabilidad, desarrollo con IA, automatización, pruebas y despliegue), sin perder i18n, SEO ni accesibilidad.

**Architecture:** Un `<Canvas>` de React Three Fiber fijo detrás de secciones DOM. Cada sección publica su progreso de scroll en un objeto mutable (`journey`); la escena lo lee en `useFrame` sin re-renderizar React. La lógica pura (ruta continua, director de vuelo, tiers, muestreo del retrato, esfera de Fibonacci) vive en `src/scene/math.js` y `src/scene/flight.js`, sin three.js, y se prueba con `node:test`. Todo se dibuja con partículas luminosas ámbar y azul.

**Tech Stack:** React 19.2, Vite 6, Tailwind 3, GSAP ScrollTrigger + Lenis, three 0.184, @react-three/fiber 9.8.1, @react-three/postprocessing 3.2.0 (+ postprocessing 6.x), react-i18next, `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-12-3d-process-portfolio-design.md`

**Estado del código:** todo el código de este plan se compiló, se pasó por lint y tests, y se revisó en el navegador en un prototipo desechable (escritorio 1440×900 y móvil 390×844, `?tier=off`, es/en). También se compilaron los estados intermedios tras las Tareas 4 y 6.

## Global Constraints

- Versiones: React 19.2 (R3F 9.8.1 exige `react <19.4`), three 0.184, @react-three/fiber 9.8.1, @react-three/postprocessing 3.2.0, postprocessing 6.x. **No** instalar `@react-three/drei`.
- Solo tema oscuro. Tokens: fondo `#07070a`, ámbar `#FCD34D` (brillo `#F59E0B`), azul `signal` `#4F8CFF`.
- **Estilo de partículas luminosas.** Prohibido añadir materiales realistas (`MeshStandardMaterial` con luces), asteroides, engranajes o más de dos planetas.
- **Ninguna animación ocupa más del 25 % de la pantalla en escritorio** (cohete, planetas, retrato). Los puntos de los planetas son finos: nunca más de 6 px.
- Todo el texto vive en el DOM y en `public/locales/{es,en}/lang.json`. El canvas es `aria-hidden` y `pointer-events: none`.
- Nada de `setState` por frame: la escena lee `journey` dentro de `useFrame`.
- `src/scene/math.js`, `flight.js`, `planetData.js` y `journey.js` no importan three.js (`math.js` y `flight.js` corren en Node).
- R3F 9 copia el prop `uniforms` al material: escribe uniforms vía `ref.current.material.uniforms` o usa una instancia real de `ShaderMaterial`.
- GLSL: no usar palabras reservadas como identificadores (`active`, `input`, `output`, `filter`, `sample`…).
- Los nombres de archivo no pueden diferir solo en mayúsculas (`Planets.jsx` / `planets.js` chocan en Windows y macOS).
- Comentarios de código y mensajes de commit en inglés; textos de la interfaz en es/en.
- MContigo nunca aparece en Experiencia. Los sistemas privados nunca se muestran con capturas.
- No se añade framework de tests. Al final de cada tarea deben pasar `npm run lint` y `npm run build` y, desde la Tarea 2, `npm run check`.
- Rama `feat/3d-process-portfolio`; un commit por tarea, terminado en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Cobertura de los pedidos del autor

| Pedido | Dónde |
|---|---|
| Quitar Expresso y Drive IAG | Tarea 5 (`Projects.jsx`) |
| Selector de idioma del tamaño de las demás pestañas | Tarea 3 (`SetLang.jsx`) |
| Cohete de forma realista, en estilo de partículas | Tarea 6 |
| Hero "Diseño. Desarrollo. Automatizo." con patrones, escalabilidad y ciclo completo | Tareas 3 y 5 |
| Sin engranajes; Proceso corto y optimizado | Tarea 5 (`Process.jsx`) |
| "Mi taller con IA" claro; herramientas pequeñas | Tarea 5 (`Automation.jsx`) |
| Cohete en movimiento durante toda la sección | Tareas 2 y 4 (ruta continua) |
| Node.js en "Formándome ahora" | Tarea 3 (`content.js`) |
| Experiencia y proyectos sin choque con las letras | Tarea 5 (`Work.jsx`, columna de texto) y Tarea 4 (`scene-scrim`) |
| Turbo menos fuerte | Tarea 6 (cola) |
| Dos planetas, estrellas; puntos de los planetas finos; nada pasa del 25 % de la pantalla en escritorio | Tareas 2 y 7 |
| Viaje con animaciones de Three.js de primer nivel | Tareas 2, 4, 6 y 7 (director de vuelo) |

## Review Focus

1. **Cambio de idioma a mitad de página.** Las alturas de sección cambian. Esperado: la cámara y la barra de estado siguen coincidiendo con la sección en pantalla (`App` refresca ScrollTrigger al cambiar idioma). Prueba: Tarea 5, paso 15.
2. **Saltos por ancla** (menú, `#process`, `#case-qsm` desde la lista de proyectos) con Lenis y vuelo continuo. Esperado: aterriza en la sección correcta, la cámara alcanza su sitio y los efectos de velocidad (líneas, FOV) se calman en un par de segundos. Prueba: Tarea 5, paso 16.
3. **Cambio de viewport** (rotar el móvil, estrechar la ventana). Esperado: cohete y planetas pasan al escenario estrecho (encima del texto, más pequeños) y los paneles mantienen el contraste. Prueba: Tarea 6, paso 7 y Tarea 7, paso 6.
4. **Fallo de WebGL a mitad de sesión** (contexto perdido o chunk 3D que no descarga). Esperado: la página cambia al fondo estático con todo el contenido legible. Prueba: Tarea 4, paso 11.
5. **Foto del retrato ausente o bloqueada.** Esperado: el cohete sigue siendo cohete y no hay más error que el 404. Prueba: Tarea 6, paso 8.

## Notas para quien ejecuta

- Entorno: Windows con Git Bash. El working tree usa CRLF (`core.autocrlf=true`); las herramientas Edit/Write lo manejan, no conviertas finales de línea a mano.
- Comandos desde la raíz del repo. Revisión visual: `npm run dev` (http://localhost:5173) en el navegador integrado de VS Code. `?tier=off|low|high` fuerza un tier desde la Tarea 4.
- Avisos esperados y aceptables: en consola, `THREE.Clock: This module has been deprecated` (lo emite R3F); en el build, el aviso de chunk mayor de 500 kB para `Scene-*.js` (la escena 3D, ~280 KB gzip, carga lazy).
- Las constantes marcadas como *calibration knob* (poses, recortes, escalas, posiciones de planetas) se pueden retocar a ojo sin tocar la lógica; si cambias los planetas, `npm run check` te dice si chocan con el camino del cohete.

## Mapa de archivos

| Archivo | Responsabilidad | Tarea |
|---|---|---|
| `eslint.config.js` | Lint flat config (sustituye `.eslintrc.cjs`) | 1 |
| `scripts/check-scene.mjs` | Tests `node:test` de la lógica pura | 2 |
| `src/scene/math.js` | Ruta continua, tiers, PRNG, muestreo, esfera de Fibonacci, constelaciones (sin three.js) | 2 |
| `src/scene/flight.js` | Director de vuelo: pasadas, FOV, estelas, cola (sin three.js) | 2 |
| `src/scene/planetData.js` | Los dos planetas | 2 |
| `src/scene/route.js` | Curva por estaciones, offsets de escenario y de crucero | 2 |
| `src/data/content.js` | Estructura del contenido (ids, herramientas, experiencias) | 3 |
| `src/scene/journey.js`, `quality.js`, `SceneBoundary.jsx`, `Scene.jsx` | Estado compartido, tiers, degradación, Canvas y Post | 4 |
| `src/scene/CameraRig.jsx`, `Stars.jsx`, `shaders.js` | Cámara de vuelo, estrellas, shaders compartidos | 4 |
| `src/hooks/useJourneySection.js`, `src/sections/*.jsx` | Progreso por sección y las seis secciones | 5 |
| `src/scene/shipGeometry.js`, `Ship.jsx` | Cohete de partículas y retrato | 6 |
| `src/scene/textures.js`, `Nebula.jsx`, `Streaks.jsx`, `Planets.jsx` | Polvo, líneas de velocidad y dos planetas | 7 |
| `src/scene/StackField.jsx` | Constelaciones del stack | 8 |
| Eliminados | `HeroBackground`, `Curtain`, `Presentation`, `About`, `ToggleTheme`, `useTheme`, `assets/andresmarquez.jpg`, `.eslintrc.cjs` | 1, 3, 4, 5 |

---

### Task 1: Herramientas — dependencias, skill de R3F y ESLint flat config

**Files:**
- Create: `eslint.config.js`
- Delete: `.eslintrc.cjs`
- Modify: `package.json`, `package-lock.json` (vía npm)

**Interfaces:**
- Consumes: nada.
- Produces: `npm run lint` funcional; dependencias `@react-three/fiber`, `@react-three/postprocessing`, `postprocessing` disponibles para las tareas 4–8.

- [ ] **Step 1: Crear la rama y commitear el spec y este plan**

```bash
git checkout -b feat/3d-process-portfolio
git add docs/superpowers/specs/2026-10-12-3d-process-portfolio-design.md docs/superpowers/plans/2026-10-12-3d-process-portfolio.md
git commit -m "$(cat <<'EOF'
docs: add 3D process portfolio spec and implementation plan

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2: Confirmar que el lint actual está roto**

Run: `npm run lint`
Expected: FAIL con `ESLint couldn't find an eslint.config.(js|mjs|cjs) file.`

- [ ] **Step 3: Instalar dependencias**

```bash
npm install @react-three/fiber@9.8.1 @react-three/postprocessing@3.2.0 postprocessing@6.39.5
npm install -D @eslint/js@9.39.4 globals@14.0.0
```

Expected: `package.json` lista las cinco dependencias nuevas.

- [ ] **Step 4: Instalar la skill de React Three Fiber (pedida por el autor)**

```bash
npx skills add https://github.com/vercel-labs/json-render --skill react-three-fiber
```

Expected: la skill queda registrada en `skills-lock.json` y en `.agents/skills/`. Si el CLI pregunta por el alcance, elige el proyecto. Léela antes de la Tarea 4.

- [ ] **Step 5: Crear `eslint.config.js` y borrar `.eslintrc.cjs`**

```js
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", ".agents", ".claude"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: "19.2" } },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    // React Three Fiber elements take three.js props that the DOM rule doesn't know.
    files: ["src/scene/**/*.jsx"],
    rules: { "react/no-unknown-property": "off" },
  },
];
```

```bash
git rm .eslintrc.cjs
```

- [ ] **Step 6: Verificar**

Run: `npm run lint`
Expected: PASS, sin problemas (exit 0).

Run: `npm run build`
Expected: `✓ built`.

- [ ] **Step 7: Commit**

Run: `git status`
Expected: solo cambian `package.json`, `package-lock.json`, `eslint.config.js`, `.eslintrc.cjs` (borrado) y los archivos de la skill (`skills-lock.json` y su carpeta). Si aparece algo más, no lo añadas.

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: add react-three-fiber deps and migrate eslint to flat config

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Lógica pura de la escena y del vuelo, con tests

**Files:**
- Create: `scripts/check-scene.mjs`, `src/scene/math.js`, `src/scene/flight.js`, `src/scene/planetData.js`, `src/scene/route.js`
- Modify: `package.json` (script `check`)

**Interfaces:**
- Consumes: `three` (solo `route.js`).
- Produces (`src/scene/math.js`, sin three.js):
  - `SECTION_IDS: string[]` = `["hero","process","automation","stack","work","contact"]`
  - `clamp01(x)`, `clamp(x, min, max)`, `smoothstep(edge0, edge1, x)`
  - `routePosition(section: Record<id, number>): number` (0 = hero … 5 = contact; suma continua del progreso de cada sección)
  - `nearStation(r, id, range = 1): boolean`
  - `pickTier({ webgl, reducedMotion, coarsePointer, cores, width }): "high" | "low" | "off"`
  - `mulberry32(seed): () => number`
  - `sampleLuminance(data, w, h, count, { threshold, height, depth, rng }): Float32Array` (`count * 3`)
  - `constellationLayout(groupSizes, rng): { stars: {x, y, z, group}[], segments: [a, b][] }`
  - `fibonacciSphere(count): Float32Array` (`count * 3`, vectores unitarios)
- Produces (`src/scene/flight.js`, sin three.js): `bell(distance, width)`, `flybys(z, planets): { bank, swerve, look }`, `SPEED_REFERENCE`, `normalizeSpeed(unitsPerSecond)`, `fovFor(speed)`, `streakAlpha(speed)`, `streakLength(speed)`, `plumeLength(speed)`.
- Produces (`src/scene/planetData.js`): `PLANETS: { id, z, dx, dy, radius, kind: "gas" | "giant", ring, reach }[]` (dos planetas, radio 3 a 4,5).
- Produces (`src/scene/route.js`): `STATIONS: Vector3[6]`, `SEGMENT_LENGTH: number[5]`, `ROUTE: CatmullRomCurve3`, `stationU(id)`, `zAt(u)`, `uAtZ(z)`, `aheadU(u, distance)`, `shipLead(r)`, `CAMERA_OFFSET: Vector3`, `stageOffset(id, aspect, target?)`, `stageScale(aspect)`, `cruiseOffset(aspect, target?)`, `planetOffset(planet, aspect, target?)`.

- [ ] **Step 1: Añadir el script `check`**

En `package.json`, el bloque `"scripts"` queda así:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "check": "node --test scripts/check-scene.mjs"
  },
```

- [ ] **Step 2: Escribir los tests**

`scripts/check-scene.mjs`:

```js
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
```

- [ ] **Step 3: Ver que fallan**

Run: `npm run check`
Expected: FAIL con `ERR_MODULE_NOT_FOUND` apuntando a `src/scene/math.js`.

- [ ] **Step 4: Implementar `src/scene/math.js`**

```js
// Pure helpers shared by the DOM and the 3D scene. No three.js imports: this file
// ships in the main bundle and runs under `node --test`.

export const SECTION_IDS = ["hero", "process", "automation", "stack", "work", "contact"];

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const clamp = (x, min, max) => Math.min(max, Math.max(min, x));

export function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// Position along the route in "stations": 0 = hero … 5 = contact. Continuous:
// every section contributes the share of it already scrolled, so the ship is
// flying the whole time instead of parking at each section.
export function routePosition(section) {
  let r = 0;
  for (let i = 0; i < SECTION_IDS.length - 1; i++) r += clamp01(section[SECTION_IDS[i]] ?? 0);
  return r;
}

// Station pieces only render while the camera is close (in stations), so
// distant ones don't clutter the sky behind the current section.
export const nearStation = (r, id, range = 1) => Math.abs(r - SECTION_IDS.indexOf(id)) < range;

// ---------------------------------------------------------------- quality

export function pickTier({ webgl, reducedMotion, coarsePointer, cores, width }) {
  if (!webgl || reducedMotion) return "off";
  if (coarsePointer || cores <= 4 || width < 768) return "low";
  return "high";
}

// ---------------------------------------------------------------- random + sampling

// Small seeded PRNG so every visit builds the same scene.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Picks `count` points from the bright pixels of an RGBA buffer; brighter
// pixels are picked more often. Returns xyz triplets centred on the image,
// `height` world units tall, y up, with brightness pushed slightly toward +z.
export function sampleLuminance(data, w, h, count, { threshold = 0.18, height = 7, depth = 0.6, rng = Math.random } = {}) {
  const out = new Float32Array(count * 3);
  const lum = new Float32Array(w * h);
  const bright = [];
  for (let i = 0; i < w * h; i++) {
    lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
    if (lum[i] > threshold) bright.push(i);
  }
  if (bright.length === 0) return out;

  const scale = height / h;
  const write = (n, i, jx, jy) => {
    out[n * 3] = ((i % w) + jx - w / 2) * scale;
    out[n * 3 + 1] = (h / 2 - Math.floor(i / w) - jy) * scale;
    out[n * 3 + 2] = (lum[i] - 0.5) * depth;
  };
  let n = 0;
  for (let tries = 0; n < count && tries < count * 50; tries++) {
    const i = bright[Math.floor(rng() * bright.length)];
    if (rng() > lum[i]) continue; // keep with probability = brightness
    write(n++, i, rng(), rng());
  }
  // Guard for very dark images: fill what is left without rejection.
  for (; n < count; n++) write(n, bright[Math.floor(rng() * bright.length)], 0.5, 0.5);
  return out;
}

// ---------------------------------------------------------------- layouts

// One small constellation per stack group, laid out left to right.
// Returns star positions and the index pairs that draw each group's outline.
export function constellationLayout(groupSizes, rng) {
  const stars = [];
  const segments = [];
  groupSizes.forEach((size, g) => {
    const cx = (g - (groupSizes.length - 1) / 2) * 2.2;
    const cy = g % 2 === 0 ? -1 : 1.2;
    const first = stars.length;
    for (let s = 0; s < size; s++) {
      const a = rng() * Math.PI * 2;
      const r = 0.3 + rng() * 0.9;
      stars.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, z: (rng() - 0.5) * 1.2, group: g });
      if (s > 0) segments.push([first + s - 1, first + s]);
    }
  });
  return { stars, segments };
}

// `count` unit vectors spread evenly over a sphere (Fibonacci lattice): no
// poles bunching, no randomness, so a particle planet has even coverage.
export function fibonacciSphere(count) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const a = golden * i;
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = Math.sin(a) * r;
  }
  return out;
}
```

- [ ] **Step 5: Implementar `src/scene/flight.js`**

```js
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
```

- [ ] **Step 6: Implementar `src/scene/planetData.js`**

```js
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
```

- [ ] **Step 7: Implementar `src/scene/route.js`**

```js
import { CatmullRomCurve3, Vector3 } from "three";
import { SECTION_IDS, smoothstep } from "./math.js";

// One station per section. The distance between stations follows the typical
// scroll window of the section that ends there (hero half a screen, work ~3),
// so the camera covers roughly the same distance per scrolled pixel everywhere.
export const STATIONS = [
  new Vector3(0, 0, 0), // hero
  new Vector3(6, 1, -12), // process
  new Vector3(-8, -2, -41), // automation
  new Vector3(4, 3, -107), // stack
  new Vector3(-4, 0, -139), // work
  new Vector3(0, 0, -233), // contact
];
export const SEGMENT_LENGTH = [12, 29, 66, 32, 94];

export const ROUTE = new CatmullRomCurve3(STATIONS, false, "catmullrom", 0.5);

// Route parameter (0..1) of a section's station. getPoint() splits the curve
// evenly between control points, so station i sits exactly at i / (n - 1).
export const stationU = (id) => SECTION_IDS.indexOf(id) / (SECTION_IDS.length - 1);

// World z of a route parameter (stations are monotonic in z).
export const zAt = (u) => ROUTE.getPoint(u).z;

// Inverse of zAt: the route parameter at world z (z falls as u grows).
export function uAtZ(z) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    if (ROUTE.getPoint(mid).z > z) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Route parameter `distance` world units ahead of `u`, using the local speed.
export function aheadU(u, distance) {
  const segment = Math.min(SEGMENT_LENGTH.length - 1, Math.floor(u * 5));
  return Math.min(1, u + distance / SEGMENT_LENGTH[segment] / 5);
}

// How far in front of the camera's focus the ship flies, in world units:
// none at the very start and end, ~10 in between.
export const shipLead = (r) => 10 * smoothstep(0.1, 0.5, r) * (1 - smoothstep(4.4, 4.95, r));

// The camera sits behind and slightly above the route point it looks at.
export const CAMERA_OFFSET = new Vector3(0, 0.6, 14);

// Where each station's 3D piece sits relative to its route point: right of
// the text on wide screens, above it on narrow ones.
const STAGE_WIDE = { hero: [4.4, 0.4, 0], stack: [4.6, 0, 0], contact: [4.6, 0, 0] };
const STAGE_NARROW_Y = { hero: 3.8, stack: 1.6, contact: 2.4 };

export function stageOffset(id, aspect, target = new Vector3()) {
  return aspect >= 1 ? target.fromArray(STAGE_WIDE[id]) : target.set(0, STAGE_NARROW_Y[id], 0);
}

export const stageScale = (aspect) => (aspect >= 1 ? 1 : 0.42);

// While cruising the ship flies off to the right of the text column (above it
// on narrow screens), so the panels never hide it.
export function cruiseOffset(aspect, target = new Vector3()) {
  return aspect >= 1 ? target.set(3.5, 0.4, 0) : target.set(0, 3, 0);
}

// Planet position relative to the route: to the right of the flight line on
// wide screens; closer in and higher up on narrow ones, where the text is full width.
export function planetOffset(planet, aspect, target = new Vector3()) {
  return aspect >= 1
    ? target.set(planet.dx, planet.dy, 0)
    : target.set(planet.dx * 0.4, planet.dy + 2.6 + planet.radius * 0.5, 0);
}
```

- [ ] **Step 8: Ver que pasan**

Run: `npm run check`
Expected: `# pass 14`, `# fail 0`.

- [ ] **Step 9: Comprobar que el test de las pasadas detecta un error de signo**

En `flybys` (`src/scene/flight.js`), cambia temporalmente `swerve -= side * w * 1.4;` por `swerve += side * w * 1.4;`.
Run: `npm run check`
Expected: FAIL en `flybys: quiet far from planets, banking away from the planet when close`.
Revierte el cambio y vuelve a correr: `# pass 14`.

- [ ] **Step 10: Lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add package.json scripts/check-scene.mjs src/scene/math.js src/scene/flight.js src/scene/planetData.js src/scene/route.js
git commit -m "$(cat <<'EOF'
feat(scene): add pure flight logic with node tests

Continuous route, flight director (banking, swerve, glance, speed
effects), the two planets and the sphere/portrait sampling helpers, all
three.js-free and covered by node:test.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Identidad oscura, estructura de contenido y textos

**Files:**
- Create: `src/data/content.js`
- Modify: `tailwind.config.js`, `src/index.css`, `index.html`, `src/layout/Header.jsx`, `src/layout/SetLang.jsx`, `src/layout/SidebarLang.jsx`, `src/hooks/useLanguage.js`, `src/components/Experiences.jsx`, `public/locales/es/lang.json`, `public/locales/en/lang.json`
- Delete: `src/layout/ToggleTheme.jsx`, `src/hooks/useTheme.js`

**Interfaces:**
- Consumes: nada de tareas anteriores.
- Produces:
  - `src/data/content.js`: `PROCESS_STEPS: number[]`, `AI_PILLARS: {n, icon}[]`, `CASES: {id, client, tools: string[]}[]` (ids `qsm`, `mcontigo`, `inventory`, `erp`, `qa`), `STACK_GROUPS: {key, items: string[]}[]` (el grupo "Formándome ahora" incluye NestJS y Node.js), `EXPERIENCES: {id, date, title, description}[]`.
  - Color Tailwind `signal` y variables CSS `--bg`, `--surface`, `--surface-2`, `--fg`, `--accent`, `--signal`.
  - Claves i18n: `nav_*`, `hero_*` (incluye `hero_pill1..5`), `process_*`, `proof`, `ai_*`, `cases_*`, `case_*`, `stack_*`, `work_kicker`, `contact_*`, `photo_alt`. Las claves heredadas que aún leen `Presentation` y `About` quedan al final, tras `"_legacy"`, hasta la Tarea 5.

- [ ] **Step 1: `tailwind.config.js` completo**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        ink: {
          950: "#070708",
          900: "#0a0a0b",
          800: "#111114",
          700: "#16161a",
          600: "#1c1c22",
          500: "#26262e",
        },
        accent: {
          DEFAULT: "#FCD34D",
          glow: "#F59E0B",
        },
        signal: "rgb(var(--signal) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['"Geist"', '"Onest"', "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', '"Geist"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(252,211,77,0.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(252,211,77,0)" },
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: `src/index.css` completo (solo oscuro; sin estilos del toggle)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
  /* Dark only: the site is a night sky. Tokens are RGB triplets for use with
     Tailwind's <alpha-value> placeholder. */
  --bg: 7 7 10;
  --surface: 14 14 18;
  --surface-2: 22 22 26;
  --fg: 245 245 247;
  --accent: 252 211 77;
  --signal: 79 140 255;
}

html {
  font-family: "Geist", "Onest", system-ui, sans-serif;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.lenis.lenis-stopped {
  overflow: hidden;
}

html,
body {
  overflow-x: clip;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  overscroll-behavior: none;
  background: rgb(var(--bg));
  color: rgb(var(--fg));
}

::selection {
  background: rgb(var(--accent) / 0.35);
  color: rgb(var(--fg));
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

/* Grain overlay */
.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.06;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

/* Edge fade for marquee */
.fade-mask {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
}

/* Carousel */
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  content-visibility: auto;
  contain-intrinsic-size: 0 96px;
}
.carousel-track {
  display: flex;
  animation: carousel-scroll 32s linear infinite;
  width: fit-content;
  will-change: transform;
}
.carousel-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-track:hover {
  animation-play-state: paused;
}
@keyframes carousel-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    animation: none;
  }
}

/* Reveal initial state (GSAP will animate from this) */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
  }
}

/* Glow utility */
.glow-accent {
  box-shadow: 0 0 0 1px rgba(252, 211, 77, 0.3),
    0 8px 32px -8px rgba(252, 211, 77, 0.4),
    0 0 60px -20px rgba(252, 211, 77, 0.5);
}

/* Glass card */
.glass {
  background: rgb(var(--fg) / 0.03);
  border: 1px solid rgb(var(--fg) / 0.08);
  backdrop-filter: blur(12px);
}

/* Magnetic / link underline */
.link-underline {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: background-size 0.3s ease;
}
.link-underline:hover {
  background-size: 100% 1px;
}

/* Custom thin scrollbar */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgb(var(--fg) / 0.16);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--fg) / 0.3);
}
```

- [ ] **Step 3: `index.html` — metas de tema**

Reemplaza:

```html
    <meta name="theme-color" content="#08080b" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#fafafc" media="(prefers-color-scheme: light)" />
    <meta name="color-scheme" content="dark light" />
```

por:

```html
    <meta name="theme-color" content="#07070a" />
    <meta name="color-scheme" content="dark" />
```

- [ ] **Step 4: `index.html` — quitar el script del tema**

Reemplaza:

```html
    <style>
      body {
        font-family: "Geist", "Onest", system-ui, sans-serif;
        background: #fafafc;
      }
      html.dark body { background: #08080b; }
      html.dark { color-scheme: dark; }
    </style>
    <script>
      (function () {
        try {
          var stored = localStorage.getItem("color-theme");
          var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          var isDark = stored ? stored === "dark" : prefersDark;
          if (isDark) document.documentElement.classList.add("dark");
        } catch (e) {}
      })();
    </script>
```

por:

```html
    <style>
      body {
        font-family: "Geist", "Onest", system-ui, sans-serif;
        background: #07070a;
      }
    </style>
```

- [ ] **Step 5: `src/data/content.js`**

```js
// Content structure shared by the DOM sections and the 3D scene.
// The copy itself lives in public/locales/{es,en}/lang.json.

export const PROCESS_STEPS = [1, 2, 3, 4, 5, 6];

export const AI_PILLARS = [
  { n: 1, icon: "las la-file-alt" },
  { n: 2, icon: "las la-brain" },
  { n: 3, icon: "las la-plug" },
  { n: 4, icon: "las la-shield-alt" },
];

export const CASES = [
  { id: "qsm", client: "QSM", tools: ["n8n", "Gemini", "Next.js", "Supabase"] },
  { id: "mcontigo", client: "MContigo", tools: ["Python", "pandas", "Deepnote", "Google Sheets API"] },
  { id: "inventory", client: "Leadbox", tools: ["Python", "GraphQL"] },
  { id: "erp", client: "Distribuciones Marver", tools: ["Laravel", "GoHighLevel", "OAuth 2.0", "Twilio"] },
  { id: "qa", client: "Leadbox", tools: ["Playwright", "OWASP ZAP", "TypeScript"] },
];

export const STACK_GROUPS = [
  {
    key: "stack_group_prod",
    items: ["Laravel", "Vue", "React", "Next.js", "Angular", "WordPress", "Tailwind CSS", "MySQL", "PostgreSQL", "Supabase"],
  },
  { key: "stack_group_auto", items: ["n8n", "Zapier", "GoHighLevel", "Python", "pandas", "Playwright"] },
  { key: "stack_group_ai", items: ["Claude Code", "MCP", "OpenSpec", "Gemini"] },
  { key: "stack_group_3d", items: ["Three.js", "React Three Fiber"] },
  { key: "stack_group_learning", items: ["NestJS", "Node.js"] },
];

export const EXPERIENCES = [
  { id: "exp5", date: "date_exp5", title: "title_exp5", description: "description_exp5" },
  { id: "exp0", date: "date_exp0", title: "title_exp0", description: "description_exp0" },
  { id: "exp1", date: "date_exp1", title: "title_exp1", description: "description_exp1" },
  { id: "exp2", date: "date_exp2", title: "title_exp2", description: "description_exp2" },
  { id: "exp3", date: "date_exp3", title: "title_exp3", description: "description_exp3" },
  { id: "exp4", date: "date_exp4", title: "title_exp4", description: "description_exp4" },
];
```

- [ ] **Step 6: `src/components/Experiences.jsx` completo (datos desde `content.js`, línea ámbar → azul)**

```jsx
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCES } from "../data/content";
import Experience from "./Experience";

gsap.registerPlugin(ScrollTrigger);

export default function Experiences() {
  const { t } = useTranslation();
  const rootRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-section-title]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
        });
        gsap.from("[data-exp-item]", {
          autoAlpha: 0,
          x: -32,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%", once: true },
        });
        gsap.fromTo(
          "[data-exp-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          }
        );
      }, rootRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="experience"
      data-section="experience"
      className="scroll-mt-24 pb-28"
    >
      <div className="mb-12 flex items-end justify-between gap-6">
        <h2
          data-section-title
          className="font-display text-3xl font-semibold tracking-tight text-fg md:text-5xl"
        >
          {t("title_exp")}
        </h2>
        <span
          aria-hidden
          className="hidden h-px flex-1 max-w-[40%] translate-y-[-0.55em] bg-gradient-to-r from-fg/15 to-transparent md:block"
        />
      </div>
      <ol className="relative ms-3">
        <span
          data-exp-line
          aria-hidden
          className="absolute left-0 top-2 h-full w-px bg-gradient-to-b from-accent/70 via-signal/50 to-transparent"
        />
        {EXPERIENCES.map((experience, i) => (
          <Experience key={`${experience.id}-${i}`} experience={experience} />
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 7: `src/layout/Header.jsx` completo (sin toggle de tema; menú aún sin cambios)**

```jsx
import { useEffect, useState } from "react";
import ItemNav from "./ItemNav";
import SidebarItem from "./SidebarItem";
import SidebarLang from "./SidebarLang";
import SetLang from "./SetLang";

const SCROLL_THRESHOLD = 10;

const NAV_ITEMS = [
  { url: "#experience", label: "experience", icon: "las la-laptop" },
  { url: "#projects", label: "projects", icon: "las la-project-diagram" },
  { url: "#about", label: "about", icon: "las la-user" },
  { url: "mailto:andres03marquez@gmail.com", label: "contact", icon: "lar la-envelope" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSidebarOpen]);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      <header className="sticky top-0 z-30 mx-auto flex h-16 w-full items-center justify-center px-4 md:h-20 md:pt-4">
        <nav
          aria-label="Main"
          className={`relative flex h-12 w-full items-center justify-between rounded-full border px-3 transition-all duration-300 md:w-auto md:gap-1 md:px-2 ${
            isScrolled || isSidebarOpen
              ? "border-fg/10 bg-surface/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <a
            href="#hero"
            aria-label="Home"
            className="ml-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg/80 hover:text-fg"
          >
            <span className="size-2 rounded-full bg-accent shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
            AM
          </a>
          <ul className="hidden items-center md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.url}>
                <ItemNav item={item} />
              </li>
            ))}
            <li className="mx-2 h-5 w-px bg-fg/10" />
            <li>
              <SetLang />
            </li>
          </ul>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation menu"
            aria-expanded={isSidebarOpen}
            aria-controls="mobile-sidebar"
            className="md:hidden inline-flex size-10 items-center justify-center rounded-full text-xl text-fg/80 transition hover:bg-fg/10 hover:text-fg"
          >
            <i className={isSidebarOpen ? "las la-times" : "las la-bars"} aria-hidden />
          </button>
        </nav>
      </header>

      <aside
        id="mobile-sidebar"
        inert={!isSidebarOpen}
        className={`md:hidden fixed top-16 right-0 z-20 h-[calc(100dvh-4rem)] w-full transition-transform duration-300 ease-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto bg-surface/95 px-4 py-6 backdrop-blur-xl">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <SidebarItem key={item.url} item={item} onNavigate={closeSidebar} />
            ))}
          </ul>
          <SidebarLang />
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Step 8: Selectores de idioma con tokens (el botón ES/EN tiene el tamaño de las demás pestañas)**

`src/layout/SetLang.jsx`:

```jsx
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";

export default function SetLang() {
  const { language, changeLanguage, supported } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const select = (lang) => {
    changeLanguage(lang);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full px-3 py-2 text-sm uppercase text-fg/70 transition hover:bg-fg/10 hover:text-fg"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {language}
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 mt-2 min-w-[6rem] overflow-hidden rounded-lg border border-fg/10 bg-surface shadow-lg"
        >
          {supported.map((lang) => (
            <li key={lang} role="option" aria-selected={lang === language}>
              <button
                type="button"
                onClick={() => select(lang)}
                className="w-full px-4 py-2 text-left text-sm uppercase hover:bg-fg/10"
              >
                {lang}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

`src/layout/SidebarLang.jsx`:

```jsx
import { useTranslation } from "react-i18next";
import { useLanguage } from "../hooks/useLanguage";

export default function SidebarLang() {
  const { t } = useTranslation();
  const { changeLanguage, supported, labels } = useLanguage();

  return (
    <div className="px-3 py-2">
      <p className="mb-2 text-xs uppercase tracking-wider text-fg/50">
        {t("language")}
      </p>
      <div className="flex gap-2">
        {supported.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => changeLanguage(code)}
            className="flex-1 rounded-lg border border-fg/10 px-3 py-2 text-sm transition hover:bg-fg/10"
          >
            {t(labels[code])}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 9: `src/hooks/useLanguage.js` — `<html lang>` sigue al idioma**

```js
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "lang";
const DEFAULT_LANG = "en";
const SUPPORTED = ["en", "es"];

const LANGUAGE_LABELS = {
  en: "english",
  es: "spanish",
};

export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LANG
  );

  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language; // screen readers pick the right voice
  }, [language, i18n]);

  const changeLanguage = (next) => {
    if (SUPPORTED.includes(next)) setLanguage(next);
  };

  return {
    language,
    changeLanguage,
    supported: SUPPORTED,
    labels: LANGUAGE_LABELS,
  };
}
```

- [ ] **Step 10: Textos**

`public/locales/es/lang.json`:

```json
{

  "nav_process": "Proceso",
  "nav_ai": "IA",
  "nav_work": "Trabajo",
  "contact": "Contacto",
  "language": "Idioma",

  "availability": "Disponible para trabajar",
  "hi": "Hola, soy Andrés Márquez",
  "contact_me": "Contáctame",

  "hero_kicker": "Andrés Márquez · Fullstack & Automation Engineer",
  "hero_line1": "Diseño.",
  "hero_line2": "Desarrollo.",
  "hero_line3": "Automatizo.",
  "hero_lead": "Así construyo software: patrones de diseño que lo mantienen simple, arquitectura que escala, desarrollo con IA, pruebas y despliegue. Cada fase con criterio humano y automatizaciones que eliminan el trabajo manual.",
  "hero_pill1": "Patrones de diseño",
  "hero_pill2": "Escalabilidad",
  "hero_pill3": "Desarrollo con IA",
  "hero_pill4": "Automatización",
  "hero_pill5": "Pruebas y despliegue",
  "hero_scroll": "Recorre el proceso",

  "process_kicker": "01 — Proceso",
  "process_title": "Cómo construyo software",
  "process_lead": "Seis fases, de la idea a producción.",
  "proof": "Prueba:",
  "process_step1_title": "Descubrir",
  "process_step1_desc": "Hablo con el negocio, encuentro el dolor real y decido qué se construye y qué se automatiza.",
  "process_step1_proof": "Requisitos del ERP de Distribuciones Marver y de Monchis Mercado, definidos con el cliente.",
  "process_step2_title": "Diseñar",
  "process_step2_desc": "Arquitectura, modelo de datos y patrones de diseño: controladores delgados, capa de servicios y adaptadores para integraciones. Todo en una spec antes del código.",
  "process_step2_proof": "ERP V-Pro 360: patrón Service, adaptadores de integraciones y migración Strangler Fig.",
  "process_step3_title": "Construir con IA",
  "process_step3_desc": "Desarrollo con agentes y skills. Yo fijo el estándar, dirijo y reviso cada cambio.",
  "process_step3_proof": "Una skill de arquitectura propia como estándar del ERP, con comandos /audit, /verify y /migrate-module.",
  "process_step4_title": "Automatizar",
  "process_step4_desc": "n8n, Zapier, GoHighLevel y Python conectan sistemas y eliminan trabajo manual.",
  "process_step4_proof": "Flujos en producción para QSM, MContigo y Distribuciones Marver.",
  "process_step5_title": "Verificar",
  "process_step5_desc": "Tests, revisión de código y medición de rendimiento antes de entregar.",
  "process_step5_proof": "Suite Playwright para sitios Leadbox; Pest y PHPStan nivel 8 en el ERP.",
  "process_step6_title": "Escalar y entregar",
  "process_step6_desc": "Despliegue, colas y tareas programadas, transacciones seguras, monitoreo e iteración. Pensado para crecer sin reescribir.",
  "process_step6_proof": "Scheduler y colas en producción en el ERP; Vulister +80 % de rendimiento frontend; Leadbox −40 % de tiempo de carga.",

  "ai_kicker": "02 — IA y automatización",
  "ai_title": "Mi taller con IA",
  "ai_lead": "La IA acelera; el criterio decide. Así trabajo con agentes todos los días.",
  "ai_pillar1_title": "Spec antes que código",
  "ai_pillar1_desc": "Brainstorming, spec escrita, plan y luego implementación. La IA no improvisa la arquitectura.",
  "ai_pillar2_title": "Contexto persistente",
  "ai_pillar2_desc": "Skills por proyecto y una memoria en Obsidian con la arquitectura documentada. El agente no redescubre lo que ya se sabe.",
  "ai_pillar3_title": "Herramientas conectadas",
  "ai_pillar3_desc": "Servidores MCP para n8n, Playwright, el editor real de WordPress y HubSpot en solo lectura.",
  "ai_pillar4_title": "Guardarraíles",
  "ai_pillar4_desc": "Ningún secreto dentro de un workflow. Solo lectura por defecto en sistemas de terceros. Despliegue solo a petición.",
  "ai_in_product": "También llevo IA al producto: agentes con Gemini dentro de flujos n8n que localizan dónde estampar firma y fechas en PDFs, con salida estructurada.",

  "cases_title": "Automatizaciones reales",
  "cases_lead": "Problema, solución y resultado. Sin capturas: son sistemas privados con datos reales.",
  "case_problem": "Problema",
  "case_solution": "Solución",
  "case_result": "Resultado",
  "case_qsm_title": "Referidos médicos de punta a punta",
  "case_qsm_problem": "Usuarios y referidos de Triple-S vivían en hojas de cálculo.",
  "case_qsm_solution": "Flujos n8n que procesan cada caso, envían correos, registran notas y estampan firma y fechas en el PDF. Panel en Next.js y Supabase con tiempo real, corrección de casos y auditoría.",
  "case_qsm_result": "Los casos atascados se corrigen desde el panel, sin tocar la base de datos.",
  "case_mcontigo_title": "Calidad de datos en Amazon España e Italia",
  "case_mcontigo_problem": "Productos de la expansión internacional sin UID o Child ASIN válido pasaban desapercibidos.",
  "case_mcontigo_solution": "Pipeline diario en Python y pandas que detecta, valida con reglas confirmadas contra los datos reales y publica en Google Sheets por API.",
  "case_mcontigo_result": "Un historial por país con la fecha de primera detección y de resolución de cada producto.",
  "case_inventory_title": "Inventario de concesionarios sin scraping",
  "case_inventory_problem": "Leadbox necesitaba el inventario de cada concesionario en su propio formato.",
  "case_inventory_solution": "En lugar de scrapear HTML, encontré el GraphQL público del sitio y lo consulté directamente con Python, sin dependencias.",
  "case_inventory_result": "477 vehículos con equipamiento completo en 4 peticiones.",
  "case_erp_title": "ERP y CRM sincronizados",
  "case_erp_problem": "El ERP y el CRM (GoHighLevel) tenían que compartir clientes, vacaciones y ausencias.",
  "case_erp_solution": "Integración OAuth 2.0 con sincronización desde Laravel. Las notificaciones (GoHighLevel, WhatsApp) salen después del commit, en su propio try/catch.",
  "case_erp_result": "Un fallo del CRM nunca deshace una operación del ERP.",
  "case_qa_title": "QA de sitios desde fuera",
  "case_qa_problem": "Probar sitios de concesionarios de los que solo tenemos la URL.",
  "case_qa_solution": "Suite Playwright en Chromium, Firefox y WebKit: responsive, formularios, cabeceras de seguridad y mapas, más escaneo OWASP ZAP.",
  "case_qa_result": "Cada corrida genera un reporte con capturas: qué falla, por qué y cómo arreglarlo.",

  "stack_kicker": "03 — Stack",
  "stack_title": "Herramientas, no identidad",
  "stack_lead": "Elijo la herramienta según el problema. Esto es lo que uso hoy.",
  "stack_group_prod": "En producción",
  "stack_group_auto": "Automatización y datos",
  "stack_group_ai": "IA",
  "stack_group_3d": "3D",
  "stack_group_learning": "Formándome ahora",

  "work_kicker": "04 — Trabajo",
  "title_exp": "Experiencia laboral",
  "brands_worked": "Marcas con las que he trabajado",

  "date_exp0": "Mayo 2024 - Actualidad",
  "title_exp0": "Frontend Developer · Leadbox (Ontario, Canadá - Remoto)",
  "description_exp0": "Resolví más de 500 tickets frontend para más de 100 clientes de marcas automotrices, mejorando el rendimiento y la experiencia de usuario en sus sitios web. Optimicé la eficiencia del código en plataformas WordPress usando Laravel, Vue.js y Tailwind CSS, reduciendo los tiempos de carga promedio en un 40% en menos de 30 horas. Colaboré con equipos multifuncionales para implementar soluciones de alto impacto en redes de concesionarios a nivel nacional, mejorando la escalabilidad y responsividad.",
  "date_exp1": "Septiembre 2024 - Enero 2025",
  "title_exp1": "Fullstack Developer · Valdusoft",
  "description_exp1": "Desarrollé un sistema de gestión para el primer dropshipping de Venezuela, construyendo funcionalidades para el administrador y la gestión de compras entre bodegas. Trabajé junto al equipo de servidores para garantizar un despliegue exitoso y eficiente del sistema en producción.",
  "date_exp2": "Diciembre 2022 - Julio 2023",
  "title_exp2": "Fullstack Developer · Vulister (Tenerife, España - Remoto)",
  "description_exp2": "Incrementé el rendimiento del frontend en un 80%, mejorando significativamente la experiencia de usuario. Participé en la reestructuración de la base de datos optimizando y eliminando tablas ineficientes. Desarrollé el 90% de las funcionalidades planificadas para usuarios administradores y creé más de 14 sitios web interactivos e informativos para clientes de la empresa.",
  "date_exp3": "Abril 2021 - Noviembre 2022",
  "title_exp3": "Fullstack Developer · Monchis Mercado (Venezuela)",
  "description_exp3": "Definí los requisitos del sistema y los objetivos del proyecto en colaboración directa con la empresa. Diseñé y construí la arquitectura de base de datos aplicando buenas prácticas y principios de normalización. Desarrollé la lógica de negocio completa entregando un sistema robusto, seguro y eficiente, y automaticé procesos manuales internos para mejorar el rendimiento operativo.",
  "date_exp4": "Julio 2020 - Febrero 2021",
  "title_exp4": "Fullstack Developer · Multiparadise (Venezuela - Híbrido)",
  "description_exp4": "Colaboré con el equipo de UX/UI para mejorar el diseño de interfaces, incrementando el rendimiento de la aplicación en un 85%. Depuré y resolví múltiples problemas de lógica del sistema garantizando una aplicación estable. Refactoricé el 75% del código base mejorando significativamente el tiempo de respuesta y desarrollé módulos de administración y funcionalidades personalizadas.",
  "date_exp5": "Noviembre 2025 - Mayo 2026",
  "title_exp5": "Fullstack Developer & Automation Engineer · Distribuciones Marver (España - Remoto)",
  "description_exp5": "Diseñé y construí un sistema ERP personalizado para gestionar inventario, ventas, compras y finanzas. Automaticé procesos manuales internos para mejorar el rendimiento operativo. Integré el sistema con la plataforma de e-commerce de la empresa para sincronizar datos de inventario y ventas, mejorando la eficiencia y reduciendo errores.",

  "title_projects": "Proyectos",
  "description_project1": "Sitio web corporativo para concesionario automotriz construido con Laravel, Vue.js y Tailwind CSS.",
  "description_project2": "Tienda en línea con servicio de entrega a domicilio, simulación de catálogo con la API de Pexels y carrito en LocalStorage.",
  "description_project3": "Plataforma estilo Q&A inspirada en Yahoo Answers y Stack Overflow.",
  "code": "Ver código",
  "view": "Ir al sitio",

  "contact_kicker": "05 — Contacto",
  "contact_title": "¿Construimos el siguiente engranaje?",
  "contact_lead": "Cuéntame el problema. Te respondo con un proceso.",
  "contact_about": "Soy Andrés Márquez, desarrollador fullstack e ingeniero de automatización en Caracas. Trabajo en remoto con equipos de Norteamérica y Europa.",
  "photo_alt": "Retrato de Andrés Márquez",

  "spanish": "Español",
  "english": "Inglés",

  "_legacy": "keys below are removed in task 5",
  "experience": "Experiencia",
  "projects": "Proyectos",
  "about": "Sobre mí",
  "text1": "+3 años de experiencia.",
  "text2": "Desarrollador Fullstack",
  "text3": "Desde Caracas, Venezuela",
  "text4": "Especializado en Laravel, Vue, React y Next.js",
  "about_title": "Sobre mí",
  "about_me": "Soy Andrés Márquez, desarrollador fullstack con más de 3 años de experiencia construyendo aplicaciones web modernas con Laravel, Vue.js y React. Profesional proactivo y autodidacta, con fuerte orientación a resultados y capacidad demostrada de adaptación a nuevas tecnologías. Tengo un historial comprobado de optimización de rendimiento, reducción de tiempos de carga y entrega de soluciones de alta calidad para clientes en Norteamérica y Europa. Si buscas un desarrollador apasionado, responsable y altamente eficaz, no dudes en contactarme.",
  "change_theme": "Cambiar tema"
}
```

`public/locales/en/lang.json`:

```json
{

  "nav_process": "Process",
  "nav_ai": "AI",
  "nav_work": "Work",
  "contact": "Contact",
  "language": "Language",

  "availability": "Available for work",
  "hi": "Hi, I'm Andrés Márquez",
  "contact_me": "Contact me",

  "hero_kicker": "Andrés Márquez · Fullstack & Automation Engineer",
  "hero_line1": "I design.",
  "hero_line2": "I develop.",
  "hero_line3": "I automate.",
  "hero_lead": "This is how I build software: design patterns that keep it simple, architecture that scales, AI-assisted development, testing and deployment. Every phase with human judgment, and automations that remove manual work.",
  "hero_pill1": "Design patterns",
  "hero_pill2": "Scalability",
  "hero_pill3": "AI-assisted development",
  "hero_pill4": "Automation",
  "hero_pill5": "Testing & deployment",
  "hero_scroll": "Explore the process",

  "process_kicker": "01 — Process",
  "process_title": "How I build software",
  "process_lead": "Six phases, from idea to production.",
  "proof": "Proof:",
  "process_step1_title": "Discover",
  "process_step1_desc": "I talk to the business, find the real pain and decide what gets built and what gets automated.",
  "process_step1_proof": "Requirements for the Distribuciones Marver ERP and Monchis Mercado, defined with the client.",
  "process_step2_title": "Design",
  "process_step2_desc": "Architecture, data model and design patterns: thin controllers, a service layer and adapters for integrations. All in a spec before any code.",
  "process_step2_proof": "ERP V-Pro 360: Service pattern, integration adapters and a Strangler Fig migration.",
  "process_step3_title": "Build with AI",
  "process_step3_desc": "Development with agents and skills. I set the standard, steer and review every change.",
  "process_step3_proof": "A custom architecture skill as the ERP's standard, with /audit, /verify and /migrate-module commands.",
  "process_step4_title": "Automate",
  "process_step4_desc": "n8n, Zapier, GoHighLevel and Python connect systems and remove manual work.",
  "process_step4_proof": "Production workflows for QSM, MContigo and Distribuciones Marver.",
  "process_step5_title": "Verify",
  "process_step5_desc": "Tests, code review and performance measurement before shipping.",
  "process_step5_proof": "Playwright suite for Leadbox sites; Pest and PHPStan level 8 on the ERP.",
  "process_step6_title": "Scale & ship",
  "process_step6_desc": "Deploy, queues and scheduled jobs, safe transactions, monitoring and iteration. Built to grow without a rewrite.",
  "process_step6_proof": "Scheduler and queues in production on the ERP; Vulister +80% frontend performance; Leadbox −40% load time.",

  "ai_kicker": "02 — AI & automation",
  "ai_title": "My AI workshop",
  "ai_lead": "AI accelerates; judgment decides. This is how I work with agents every day.",
  "ai_pillar1_title": "Spec before code",
  "ai_pillar1_desc": "Brainstorm, written spec, plan, then implementation. AI never improvises the architecture.",
  "ai_pillar2_title": "Persistent context",
  "ai_pillar2_desc": "Per-project skills and an Obsidian memory with documented architecture. The agent never rediscovers what is already known.",
  "ai_pillar3_title": "Connected tools",
  "ai_pillar3_desc": "MCP servers for n8n, Playwright, the real WordPress editor and read-only HubSpot.",
  "ai_pillar4_title": "Guardrails",
  "ai_pillar4_desc": "No secret ever lives inside a workflow. Read-only by default on third-party systems. Deploys only on request.",
  "ai_in_product": "I also ship AI inside products: Gemini agents in n8n flows that locate where to stamp signatures and dates on PDFs, with structured output.",

  "cases_title": "Real automations",
  "cases_lead": "Problem, solution and result. No screenshots: these are private systems with real data.",
  "case_problem": "Problem",
  "case_solution": "Solution",
  "case_result": "Result",
  "case_qsm_title": "End-to-end medical referrals",
  "case_qsm_problem": "Triple-S users and referrals lived in spreadsheets.",
  "case_qsm_solution": "n8n flows that process every case, send emails, log notes and stamp signature and dates on the PDF. A Next.js + Supabase panel with real-time updates, case correction and an audit trail.",
  "case_qsm_result": "Stuck cases get fixed from the panel, without touching the database.",
  "case_mcontigo_title": "Data quality for Amazon Spain and Italy",
  "case_mcontigo_problem": "International-expansion products without a valid UID or Child ASIN went unnoticed.",
  "case_mcontigo_solution": "A daily Python + pandas pipeline that detects, validates with rules confirmed against the real data and publishes to Google Sheets through the API.",
  "case_mcontigo_result": "A per-country history with the first-detection and resolution date of every product.",
  "case_inventory_title": "Dealer inventory without scraping",
  "case_inventory_problem": "Leadbox needed each dealership's inventory in its own format.",
  "case_inventory_solution": "Instead of scraping HTML, I found the site's public GraphQL endpoint and queried it directly with dependency-free Python.",
  "case_inventory_result": "477 vehicles with full equipment in 4 requests.",
  "case_erp_title": "ERP and CRM in sync",
  "case_erp_problem": "The ERP and the CRM (GoHighLevel) had to share customers, vacations and absences.",
  "case_erp_solution": "OAuth 2.0 integration with sync from Laravel. Notifications (GoHighLevel, WhatsApp) fire after the commit, in their own try/catch.",
  "case_erp_result": "A CRM outage never rolls back an ERP operation.",
  "case_qa_title": "Outside-in site QA",
  "case_qa_problem": "Testing dealership sites when all you have is the URL.",
  "case_qa_solution": "A Playwright suite across Chromium, Firefox and WebKit: responsive, forms, security headers and maps, plus OWASP ZAP scans.",
  "case_qa_result": "Every run produces a report with screenshots: what fails, why and how to fix it.",

  "stack_kicker": "03 — Stack",
  "stack_title": "Tools, not identity",
  "stack_lead": "I pick the tool for the problem. This is what I use today.",
  "stack_group_prod": "In production",
  "stack_group_auto": "Automation & data",
  "stack_group_ai": "AI",
  "stack_group_3d": "3D",
  "stack_group_learning": "Learning now",

  "work_kicker": "04 — Work",
  "title_exp": "Work experience",
  "brands_worked": "Brands I've worked with",

  "date_exp0": "May 2024 - Present",
  "title_exp0": "Frontend Developer · Leadbox (Canada - Remote)",
  "description_exp0": "Resolved 500+ frontend tickets for 100+ automotive clients, improving performance and user experience across their websites. Optimized code efficiency on WordPress platforms using Laravel, Vue.js and Tailwind CSS, cutting average load times by 40% in under 30 hours. Collaborated with cross-functional teams to ship high-impact solutions across nationwide dealer networks, improving scalability and responsiveness.",
  "date_exp1": "September 2024 - January 2025",
  "title_exp1": "Fullstack Developer · Valdusoft (Venezuela - Remote)",
  "description_exp1": "Built a management system for the first dropshipping operation in Venezuela, delivering admin features and inter-warehouse purchase management. Worked closely with the infrastructure team to ensure a successful and efficient production deployment.",
  "date_exp2": "December 2022 - July 2023",
  "title_exp2": "Fullstack Developer · Vulister (Spain - Remote)",
  "description_exp2": "Increased frontend performance by 80%, significantly improving user experience. Participated in restructuring the database, optimizing and removing inefficient tables. Delivered 90% of the planned admin features and built 14+ interactive and informational websites for company clients.",
  "date_exp3": "April 2021 - November 2022",
  "title_exp3": "Fullstack Developer · Monchis Mercado (Venezuela - Hybrid)",
  "description_exp3": "Defined system requirements and project goals in direct collaboration with the company. Designed and built the database architecture applying best practices and normalization principles. Developed the full business-logic layer, delivering a robust, secure and efficient system, and automated internal manual processes to boost operational performance.",
  "date_exp4": "July 2020 - February 2021",
  "title_exp4": "Fullstack Developer · Multiparadise (Venezuela - Hybrid)",
  "description_exp4": "Collaborated with the UX/UI team to improve interface design, boosting application performance by 85%. Debugged and fixed multiple system-logic issues to keep the app stable. Refactored 75% of the codebase, significantly improving response times, and built admin modules and custom features to extend platform capabilities.",
  "date_exp5": "November 2025 - May 2026",
  "title_exp5": "Fullstack Developer & Automation Engineer · Distribuciones Marver (Spain - Remote)",
  "description_exp5": "Designed and built a custom ERP system to manage inventory, sales, purchases and finances. Automated internal manual processes to boost operational performance. Integrated the system with the company's e-commerce platform to synchronize inventory and sales data, improving efficiency and reducing errors.",

  "title_projects": "Projects",
  "description_project1": "Corporate website for an automotive dealership built with Laravel, Vue.js and Tailwind CSS.",
  "description_project2": "Online store with home delivery, catalog simulation using the Pexels API and a LocalStorage-backed shopping cart.",
  "description_project3": "Q&A platform inspired by Yahoo Answers and Stack Overflow.",
  "code": "View code",
  "view": "Visit site",

  "contact_kicker": "05 — Contact",
  "contact_title": "Shall we build the next gear?",
  "contact_lead": "Tell me the problem. I'll answer with a process.",
  "contact_about": "I'm Andrés Márquez, a fullstack developer and automation engineer based in Caracas. I work remotely with teams in North America and Europe.",
  "photo_alt": "Portrait of Andrés Márquez",

  "spanish": "Spanish",
  "english": "English",

  "_legacy": "keys below are removed in task 5",
  "experience": "Experience",
  "projects": "Projects",
  "about": "About",
  "text1": "+3 years of experience.",
  "text2": "Fullstack Developer",
  "text3": "From Caracas, Venezuela",
  "text4": "Specialized in Laravel, Vue, React and Next.js",
  "about_title": "About me",
  "about_me": "I'm Andrés Márquez, a fullstack developer with 3+ years of experience building modern web applications with Laravel, Vue.js and React. Proactive and self-taught, results-driven and quick to adopt new technologies. Proven track record of performance optimization, load-time reduction and high-quality delivery for clients in North America and Europe. If you're looking for a passionate, reliable and highly effective developer, feel free to reach out.",
  "change_theme": "Change theme"
}
```

- [ ] **Step 11: Borrar el toggle de tema**

```bash
git rm src/layout/ToggleTheme.jsx src/hooks/useTheme.js
```

- [ ] **Step 12: Verificar**

Run: `npm run lint && npm run check && npm run build`
Expected: los tres PASS.

Run: `npm run dev` y abre http://localhost:5173.
Expected: página oscura sin toggle de tema; la línea de experiencia va de ámbar a azul; el botón ES/EN del menú tiene el mismo tamaño y estilo que "Experiencia/Proyectos…"; al cambiar a ES, `document.documentElement.lang === "es"` (compruébalo en la consola) y el título de Marver dice "Distribuciones".

- [ ] **Step 13: Commit**

```bash
git add -A src/index.css tailwind.config.js index.html src/data/content.js src/components/Experiences.jsx src/layout src/hooks public/locales
git commit -m "$(cat <<'EOF'
feat: dark-only identity and process-first copy

Drop the light theme and its toggle, add the signal blue token, move
experience data to a shared content module, size the language tab like the
others and add the es/en copy for the new sections. Fix two typos in the
Marver entry.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Escena base — cámara de vuelo, estrellas, postproceso y fondo estático

**Files:**
- Create: `src/scene/journey.js`, `src/scene/quality.js`, `src/scene/SceneBoundary.jsx`, `src/scene/Scene.jsx`, `src/scene/CameraRig.jsx`, `src/scene/Stars.jsx`, `src/scene/shaders.js`
- Modify: `src/App.jsx`, `src/index.css`
- Delete: `src/components/HeroBackground.jsx`, `src/components/Curtain.jsx`

**Interfaces:**
- Consumes: `routePosition`, `SECTION_IDS`, `pickTier`, `mulberry32` (`math.js`); `flybys`, `fovFor`, `normalizeSpeed` (`flight.js`); `PLANETS`; `ROUTE`, `CAMERA_OFFSET` (`route.js`).
- Produces:
  - `journey`: `{ section: Record<id, number>, speed: number }` (mutable).
  - `QUALITY: { high, low }` con `{ stars, hullParticles, plume, streaks, nebula, planetPoints, ringPoints, bloom, post, maxDpr }`; `detectTier(): "high" | "low" | "off"` (acepta `?tier=`).
  - `glowPointFragment` y `planetPointFragment` (fragment shaders; esperan `vColor` y `vAlpha`).
  - `<Scene tier onFail />` (default export, carga lazy); `<SceneBoundary onFail>`.
  - Clases CSS `.scene-scrim` y `.scene-fallback`.

- [ ] **Step 1: `src/scene/journey.js`**

```js
// Shared scroll state. DOM hooks write it; the 3D scene reads it every frame.
// A plain mutable object on purpose: scrolling must not re-render React.
export const journey = {
  section: { hero: 0, process: 0, automation: 0, stack: 0, work: 0, contact: 0 },
  speed: 0, // camera speed, 0..1, written by CameraRig and read by the ship, streaks and post FX
};
```

- [ ] **Step 2: `src/scene/quality.js`**

```js
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
  if (forced === "off" || forced in QUALITY) return forced;
  return pickTier({
    webgl: hasWebGL2(),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    cores: navigator.hardwareConcurrency ?? 4,
    width: window.innerWidth,
  });
}
```

- [ ] **Step 3: `src/scene/SceneBoundary.jsx`**

```jsx
import { Component } from "react";

// Any failure in the 3D layer (WebGL context, chunk download, shader compile)
// drops the page to its static version instead of leaving a blank screen.
export default class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("3D scene disabled:", error);
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
```

- [ ] **Step 4: `src/scene/shaders.js`**

```js
// Round, soft particle shared by every point cloud that uses a ShaderMaterial.
// Expects vColor (linear) and vAlpha from the vertex shader.
export const glowPointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * (0.5 + glow), glow * vAlpha);
    #include <colorspace_fragment>
  }
`;

// Dense planet particles: a flat soft disc with no extra glow, so thousands of
// overlapping points add up to a solid-looking globe instead of a white blob.
export const planetPointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.3, d));
    #include <colorspace_fragment>
  }
`;
```

- [ ] **Step 5: `src/scene/CameraRig.jsx`**

```jsx
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { journey } from "./journey";
import { flybys, fovFor, normalizeSpeed } from "./flight";
import { routePosition, SECTION_IDS } from "./math";
import { PLANETS } from "./planetData";
import { CAMERA_OFFSET, ROUTE } from "./route";

// Frame-rate independent smoothing factor.
const damp = (rate, delta) => 1 - Math.exp(-rate * delta);

// Flies the camera along the route as the reader scrolls. Reads the scroll,
// publishes how fast we are going (journey.speed) and adds the cinematic
// layer: a glance at passing planets, a slight roll into them, a wider lens
// when going fast and a little pointer parallax.
export default function CameraRig() {
  const focus = useMemo(() => new Vector3(), []);
  const previous = useMemo(() => new Vector3(), []);
  const goal = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const state = useMemo(() => ({ ready: false, speed: 0, pointerX: 0, pointerY: 0 }), []);

  useEffect(() => {
    const onMove = (e) => {
      state.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [state]);

  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1); // a hidden tab must not teleport the camera
    const u = routePosition(journey.section) / (SECTION_IDS.length - 1);
    ROUTE.getPoint(u, focus);

    if (!state.ready) {
      state.ready = true;
      previous.copy(focus);
      camera.position.copy(focus).add(CAMERA_OFFSET);
      look.copy(focus);
    }
    if (delta > 0) {
      const perSecond = focus.distanceTo(previous) / delta;
      state.speed += (perSecond - state.speed) * damp(5, delta);
    }
    previous.copy(focus);
    journey.speed = normalizeSpeed(state.speed);

    const glance = flybys(focus.z, PLANETS);

    goal.copy(focus).add(CAMERA_OFFSET);
    goal.x += state.pointerX * 0.8 - glance.look * 0.45;
    goal.y += state.pointerY * 0.5;
    goal.z += journey.speed * 2.5;
    camera.position.lerp(goal, damp(4, delta));

    target.copy(focus);
    target.x += glance.look;
    look.lerp(target, damp(4, delta));
    camera.lookAt(look);
    camera.rotateZ(-glance.bank * 0.1);

    const fov = fovFor(journey.speed);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov += (fov - camera.fov) * damp(3, delta);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
```

- [ ] **Step 6: `src/scene/Stars.jsx`**

```jsx
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color } from "three";
import { mulberry32 } from "./math";
import { glowPointFragment } from "./shaders";

const TINTS = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#dbe6ff", "#dbe6ff", "#FCD34D", "#4F8CFF"];
const STAR_SIZE = 2.4; // px before device pixel ratio

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute vec3 aColor;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    // each star twinkles at its own pace
    vAlpha = (0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 2.4) + aSeed * 60.0)) * (0.3 + 0.7 * aSeed);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (0.5 + 1.6 * aSeed * aSeed);
  }
`;

// Star field around the whole route: twinkling points in three tints, denser
// and brighter ones scattered in depth so the flight reads as parallax.
export default function Stars({ count }) {
  const gl = useThree((s) => s.gl);
  const ref = useRef(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSize: { value: STAR_SIZE } }), []);
  const [positions, colors, seeds] = useMemo(() => {
    const rng = mulberry32(11);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const c = new Color();
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rng() - 0.5) * 180;
      pos[i * 3 + 1] = (rng() - 0.5) * 110;
      pos[i * 3 + 2] = 40 - rng() * 340;
      c.set(TINTS[Math.floor(rng() * TINTS.length)]).multiplyScalar(0.45 + rng() * 0.55);
      c.toArray(col, i * 3);
      seed[i] = rng();
    }
    return [pos, col, seed];
  }, [count]);

  useFrame(({ clock }) => {
    // R3F copies the `uniforms` prop into the material: write to the material's own.
    const live = ref.current.material.uniforms;
    live.uTime.value = clock.elapsedTime;
    live.uSize.value = STAR_SIZE * gl.getPixelRatio();
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={glowPointFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 7: `src/scene/Scene.jsx` (cámara, estrellas y postproceso por ahora)**

```jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Vector2 } from "three";
import { journey } from "./journey";
import { QUALITY } from "./quality";
import CameraRig from "./CameraRig";
import Stars from "./Stars";

const BACKGROUND = "#07070a";

// Cinematic grade: bloom for the glow, a soft vignette, and a hair of colour
// fringing that grows with speed (kept tiny on purpose).
function Post() {
  const aberration = useRef(null);
  const offset = useMemo(() => new Vector2(0, 0), []);
  useFrame(() => {
    // none at rest: at 1px stars, any fringing turns them into red/blue confetti
    const amount = journey.speed * 0.0007;
    aberration.current?.offset.set(amount, amount);
  });
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur luminanceThreshold={0.7} luminanceSmoothing={0.25} intensity={0.85} />
      <Vignette eskil={false} offset={0.25} darkness={0.7} />
      <ChromaticAberration ref={aberration} offset={offset} radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  );
}

// Fixed, decorative canvas behind the page. All text lives in the DOM.
export default function Scene({ tier, onFail }) {
  const quality = QUALITY[tier];
  const [visible, setVisible] = useState(() => !document.hidden);

  // Hidden tab: stop rendering instead of burning GPU in the background.
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, quality.maxDpr]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 45, near: 0.1, far: 500, position: [0, 0.6, 14] }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
        }}
      >
        <color attach="background" args={[BACKGROUND]} />
        <CameraRig />
        <Stars count={quality.stars} />
        {quality.post && <Post />}
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 8: Scrim y fondo estático en `src/index.css`**

Reemplaza:

```css
  color: rgb(var(--fg));
}

::selection {
```

por:

```css
  color: rgb(var(--fg));
}

/* Keeps text on the left readable wherever a planet or nebula drifts by. */
.scene-scrim {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(90deg, rgb(var(--bg) / 0.72) 0%, rgb(var(--bg) / 0.4) 38%, transparent 62%);
}
@media (max-width: 767px) {
  .scene-scrim {
    background: linear-gradient(0deg, rgb(var(--bg) / 0.6) 0%, transparent 55%);
  }
}

/* Static backdrop used when the 3D scene is off (no WebGL, reduced motion). */
.scene-fallback {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(60% 50% at 80% 20%, rgb(var(--accent) / 0.12), transparent 70%),
    radial-gradient(50% 40% at 10% 90%, rgb(var(--signal) / 0.12), transparent 70%),
    rgb(var(--bg));
}

::selection {
```

- [ ] **Step 9: `src/App.jsx` provisional (escena nueva, secciones antiguas, sin cortina)**

```jsx
import { lazy, Suspense, useState } from "react";
import About from "./components/About";
import BrandsCarousel from "./components/BrandsCarousel";
import Experiences from "./components/Experiences";
import Presentation from "./components/Presentation";
import Projects from "./components/Projects";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import ScrollRail from "./layout/ScrollRail";
import StatusBar from "./layout/StatusBar";
import SceneBoundary from "./scene/SceneBoundary";
import { detectTier } from "./scene/quality";
import { useLenis } from "./hooks/useLenis";

const Scene = lazy(() => import("./scene/Scene"));

export default function App() {
  useLenis();
  const [tier, setTier] = useState(detectTier);
  const disableScene = () => setTier("off");

  return (
    <div className="relative text-fg">
      {tier !== "off" ? (
        <SceneBoundary onFail={disableScene}>
          <Suspense fallback={null}>
            <Scene tier={tier} onFail={disableScene} />
          </Suspense>
        </SceneBoundary>
      ) : (
        <div aria-hidden="true" className="scene-fallback" />
      )}
      {tier !== "off" && <div className="scene-scrim" />}
      <div className="grain" />
      <Header />
      <StatusBar />
      <ScrollRail />
      <main className="relative z-10 px-4">
        <section id="hero" className="relative min-h-[92dvh]">
          <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-24 md:pt-36">
            <Presentation start />
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl">
          <div className="my-16 md:my-24">
            <BrandsCarousel />
          </div>
          <Experiences />
          <Projects />
          <About />
          <Footer />
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 10: Borrar el fondo y la cortina antiguos**

```bash
git rm src/components/HeroBackground.jsx src/components/Curtain.jsx
```

- [ ] **Step 11: Verificar**

Run: `npm run lint && npm run check && npm run build`
Expected: los tres PASS; el build emite un chunk `Scene-*.js` aparte.

Run: `grep -c "WebGLRenderer" dist/assets/index-*.js`
Expected: `0` (three.js fuera del bundle principal).

Run: `npm run dev` y abre http://localhost:5173.
Expected: estrellas que titilan detrás del contenido; al mover el ratón la cámara se desplaza un poco; al hacer scroll las estrellas se mueven (la cámara vuela, sin pausas); el hero aparece al instante (sin cortina). En `http://localhost:5173/?tier=off`: no hay `<canvas>` y el fondo es el degradado estático.

- [ ] **Step 12: Review Focus 4 — pérdida de contexto WebGL**

Con la página normal abierta, en la consola:

```js
document.querySelector("canvas").getContext("webgl2").getExtension("WEBGL_lose_context").loseContext();
```

Expected: el `<canvas>` desaparece, aparece `.scene-fallback` y todo el contenido sigue legible y navegable.

- [ ] **Step 13: Commit**

```bash
git add -A src/scene src/App.jsx src/index.css src/components
git commit -m "$(cat <<'EOF'
feat(scene): add 3D scene shell with flight camera and starfield

Lazy R3F canvas behind the page: a camera that flies the route and
glances at passing planets, twinkling stars, bloom and vignette, quality
tiers with a ?tier= override for QA, and a static backdrop when WebGL is
missing, lost or motion is reduced. Removes the flag shader and the intro
curtain that delayed LCP.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Nueva estructura de página

**Files:**
- Create: `src/hooks/useJourneySection.js`, `src/sections/SectionHeading.jsx`, `src/sections/Hero.jsx`, `src/sections/Process.jsx`, `src/sections/Automation.jsx`, `src/sections/Stack.jsx`, `src/sections/Work.jsx`, `src/sections/Contact.jsx`, `public/images/andres.jpg`
- Modify: `src/App.jsx`, `src/layout/Header.jsx`, `src/layout/StatusBar.jsx`, `src/components/Projects.jsx`, `src/components/ProjectIndex.jsx`, `public/locales/es/lang.json`, `public/locales/en/lang.json`
- Delete: `src/components/Presentation.jsx`, `src/components/About.jsx`, `src/assets/andresmarquez.jpg`

**Interfaces:**
- Consumes: `journey` (Tarea 4); `PROCESS_STEPS`, `AI_PILLARS`, `CASES`, `STACK_GROUPS` (`content.js`); `detectTier`, `SceneBoundary`, `Scene`.
- Produces:
  - `useJourneySection(id: string, onProgress?: (p: number) => void, { start?: string }): RefObject` — escribe `journey.section[id]`; el hero pasa `start: "top top"`.
  - Secciones con ids `hero`, `process`, `automation`, `stack`, `work`, `contact`; tarjetas de caso con id `case-{id}`.
  - `Contact({ immersive })`: con `immersive=false` es una sección normal.
  - Proyectos privados (`urlProject` que empieza por `#`) enlazan a su caso en la misma página.

- [ ] **Step 1: `src/hooks/useJourneySection.js`**

```js
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "../scene/journey";

gsap.registerPlugin(ScrollTrigger);

// Publishes how far the viewport's centre line has crossed this section
// (0 = section top at the centre, 1 = section bottom at the centre) to the 3D
// scene through `journey.section[id]`. Sections are contiguous, so exactly one
// of them is "in progress" at any time. The hero passes start: "top top": its top
// is already above the centre line at scroll 0, so the default would begin at 0.5.
export function useJourneySection(id, onProgress, { start = "top center" } = {}) {
  const ref = useRef(null);
  const callback = useRef(onProgress);

  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const publish = (self) => {
      journey.section[id] = self.progress;
      callback.current?.(self.progress);
    };
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end: "bottom center",
      onUpdate: publish,
      onRefresh: publish,
    });
    return () => trigger.kill();
  }, [id, start]);

  return ref;
}
```

- [ ] **Step 2: `src/sections/SectionHeading.jsx`**

```jsx
export default function SectionHeading({ kicker, title, lead }) {
  return (
    <header className="max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{kicker}</p>
      <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg md:text-6xl">{title}</h2>
      {lead && <p className="mt-5 text-pretty text-base text-fg/70 md:text-lg">{lead}</p>}
    </header>
  );
}
```

- [ ] **Step 3: `src/sections/Hero.jsx`**

```jsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { useJourneySection } from "../hooks/useJourneySection";
import { WHATSAPP_URL } from "../data/contacts";

const LINES = ["hero_line1", "hero_line2", "hero_line3"];
const PILLS = [1, 2, 3, 4, 5];

export default function Hero() {
  const { t } = useTranslation();
  const ref = useJourneySection("hero", undefined, { start: "top top" });

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-hero-line]", { yPercent: 105, duration: 1, stagger: 0.08 })
          .from("[data-hero-fade]", { autoAlpha: 0, y: 12, duration: 0.7, stagger: 0.06 }, 0.3);
      },
      ref
    );
    return () => mm.revert();
  }, [ref]);

  return (
    <section ref={ref} id="hero" className="relative flex min-h-[100dvh] items-end pb-20 md:items-center md:pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 pt-28">
        <p data-hero-fade className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/70">
          <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          {t("availability")}
        </p>
        <p data-hero-fade className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/50">
          {t("hero_kicker")}
        </p>
        <h1
          className="mt-8 font-display font-bold leading-[0.92] tracking-[-0.03em]"
          style={{ fontSize: "clamp(2.75rem, 8vw, 7.25rem)" }}
        >
          {LINES.map((key, i) => (
            <span key={key} className="block overflow-hidden pb-[0.06em]">
              <span
                data-hero-line
                className={`block ${
                  i === LINES.length - 1
                    ? "bg-gradient-to-r from-accent to-signal bg-clip-text text-transparent"
                    : "text-fg"
                }`}
              >
                {t(key)}
              </span>
            </span>
          ))}
        </h1>
        <p data-hero-fade className="mt-8 max-w-xl text-pretty text-base text-fg/75 md:text-lg">
          {t("hero_lead")}
        </p>
        <ul data-hero-fade className="mt-6 flex max-w-xl flex-wrap gap-2">
          {PILLS.map((n) => (
            <li
              key={n}
              className="rounded-full border border-fg/15 bg-bg/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-fg/70"
            >
              {t(`hero_pill${n}`)}
            </li>
          ))}
        </ul>
        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-6">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink-950 transition glow-accent hover:bg-accent-glow"
          >
            <i className="lab la-whatsapp text-lg" aria-hidden />
            {t("contact_me")}
          </a>
          <a
            href="#process"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg/60 transition hover:text-fg"
          >
            {t("hero_scroll")}
            <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `src/sections/Process.jsx` (seis fases en cuadrícula compacta, sin sticky)**

```jsx
import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import { PROCESS_STEPS } from "../data/content";
import SectionHeading from "./SectionHeading";

// The six phases of building software, as a compact grid: one screen on
// desktop, no sticky panel and no extra scroll while the ship keeps flying.
export default function Process() {
  const { t } = useTranslation();
  const ref = useJourneySection("process");

  return (
    <section ref={ref} id="process" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="lg:max-w-[58%]">
          <SectionHeading kicker={t("process_kicker")} title={t("process_title")} lead={t("process_lead")} />
          <ol className="mt-12 grid gap-3 md:grid-cols-2">
          {PROCESS_STEPS.map((n) => (
            <li key={n} className="rounded-2xl border border-fg/10 bg-surface/90 p-5 backdrop-blur-sm">
              <p className="font-mono text-[11px] tracking-[0.3em] text-accent">
                {String(n).padStart(2, "0")} / {String(PROCESS_STEPS.length).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-fg">{t(`process_step${n}_title`)}</h3>
              <p className="mt-2 text-sm text-fg/75">{t(`process_step${n}_desc`)}</p>
              <p className="mt-3 border-t border-fg/10 pt-3 text-xs text-fg/55">
                <span className="text-signal">{t("proof")}</span> {t(`process_step${n}_proof`)}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: `src/sections/Automation.jsx` (taller con IA y casos)**

```jsx
import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import { AI_PILLARS, CASES } from "../data/content";
import SectionHeading from "./SectionHeading";

const CASE_PARTS = ["problem", "solution", "result"];

export default function Automation() {
  const { t } = useTranslation();
  const ref = useJourneySection("automation");

  return (
    <section ref={ref} id="automation" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-bg/85 p-6 backdrop-blur-sm md:p-8 lg:max-w-[58%]">
          <SectionHeading kicker={t("ai_kicker")} title={t("ai_title")} lead={t("ai_lead")} />

          {/* Four steps that read left to right: spec, context, tools, guardrails. */}
          <ol className="mt-10 grid gap-3 sm:grid-cols-2">
            {AI_PILLARS.map(({ n, icon }) => (
              <li key={n} className="relative rounded-2xl border border-fg/10 bg-surface/90 p-5">
                <span className="relative flex size-12 items-center justify-center rounded-full border border-accent/40 bg-bg text-2xl text-accent">
                  <i className={icon} aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-fg">{t(`ai_pillar${n}_title`)}</h3>
                <p className="mt-1 text-sm text-fg/70">{t(`ai_pillar${n}_desc`)}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-fg/60">{t("ai_in_product")}</p>

          <h3 className="mt-20 font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">{t("cases_title")}</h3>
          <p className="mt-3 max-w-2xl text-fg/70">{t("cases_lead")}</p>
          <ol className="mt-8 space-y-4">
            {CASES.map((c) => (
              <li key={c.id} id={`case-${c.id}`} className="scroll-mt-28 rounded-2xl border border-fg/10 bg-surface/90 p-5 md:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-display text-xl font-semibold text-fg md:text-2xl">{t(`case_${c.id}_title`)}</h4>
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{c.client}</p>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  {CASE_PARTS.map((part) => (
                    <div key={part} className="sm:grid sm:grid-cols-[5.5rem_1fr] sm:gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg/45">{t(`case_${part}`)}</dt>
                      <dd className="mt-1 text-fg/80">{t(`case_${c.id}_${part}`)}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {c.tools.map((tool) => (
                    <li key={tool} className="rounded-full border border-fg/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-fg/60">
                      {tool}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: `src/sections/Stack.jsx` y `src/sections/Work.jsx`**

```jsx
import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import { STACK_GROUPS } from "../data/content";
import SectionHeading from "./SectionHeading";

export default function Stack() {
  const { t } = useTranslation();
  const ref = useJourneySection("stack");

  return (
    <section ref={ref} id="stack" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-bg/80 p-5 backdrop-blur-sm md:p-6 lg:max-w-[58%]">
          <SectionHeading kicker={t("stack_kicker")} title={t("stack_title")} lead={t("stack_lead")} />
          <dl className="mt-10 space-y-6">
            {STACK_GROUPS.map((group) => (
              <div key={group.key} className="border-t border-fg/10 pt-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg/50">{t(group.key)}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full bg-fg/5 px-2.5 py-1 text-xs text-fg/85">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
```

```jsx
import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import BrandsCarousel from "../components/BrandsCarousel";
import Experiences from "../components/Experiences";
import Projects from "../components/Projects";

export default function Work() {
  const { t } = useTranslation();
  const ref = useJourneySection("work");

  return (
    <section ref={ref} id="work" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{t("work_kicker")}</p>
        <div className="mt-6 rounded-3xl bg-bg/95 p-6 backdrop-blur-md md:p-10 lg:max-w-[58%]">
          <BrandsCarousel />
          <div className="mt-16">
            <Experiences />
          </div>
          <Projects />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: `src/sections/Contact.jsx` y la foto**

```jsx
import { useTranslation } from "react-i18next";
import { useJourneySection } from "../hooks/useJourneySection";
import { CONTACTS, WHATSAPP_URL } from "../data/contacts";
import SectionHeading from "./SectionHeading";

// Immersive: extra scroll room (sticky panel) while the ship's particles
// rebuild into the portrait on the right.
export default function Contact({ immersive }) {
  const { t } = useTranslation();
  const ref = useJourneySection("contact");

  return (
    <section ref={ref} id="contact" className={`relative ${immersive ? "h-[160vh]" : "py-28"}`}>
      <div className={`flex items-end pb-12 md:items-center md:pb-0 ${immersive ? "sticky top-0 h-[100dvh]" : ""}`}>
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="max-w-xl rounded-3xl bg-bg/70 p-5 backdrop-blur-sm md:p-6">
            <SectionHeading kicker={t("contact_kicker")} title={t("contact_title")} lead={t("contact_lead")} />
            <div className="mt-8 flex items-center gap-4">
              <img
                src="/images/andres.jpg"
                alt={t("photo_alt")}
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                className="size-16 shrink-0 rounded-full border border-fg/15 object-cover object-[50%_15%]"
              />
              <p className="text-sm text-fg/70 md:text-base">{t("contact_about")}</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink-950 transition glow-accent hover:bg-accent-glow"
              >
                <i className="lab la-whatsapp text-lg" aria-hidden />
                {t("contact_me")}
              </a>
              {CONTACTS.filter((c) => !c.url.startsWith("https://wa.me")).map(({ icon, url, name }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-4 py-2.5 text-sm text-fg/80 transition hover:border-fg/30 hover:bg-fg/10 hover:text-fg"
                >
                  <i className={`${icon} text-base`} aria-hidden />
                  {t(name)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

```bash
cp "/c/Users/pc/Downloads/andres.jpeg" public/images/andres.jpg
```

- [ ] **Step 8: `src/App.jsx` definitivo**

```jsx
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import ScrollRail from "./layout/ScrollRail";
import StatusBar from "./layout/StatusBar";
import Automation from "./sections/Automation";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import Process from "./sections/Process";
import Stack from "./sections/Stack";
import Work from "./sections/Work";
import SceneBoundary from "./scene/SceneBoundary";
import { detectTier } from "./scene/quality";
import { useLenis } from "./hooks/useLenis";

const Scene = lazy(() => import("./scene/Scene"));

export default function App() {
  useLenis();
  const { i18n } = useTranslation();
  const [tier, setTier] = useState(detectTier);
  const immersive = tier !== "off";
  const disableScene = () => setTier("off");

  // Section heights change with the language and the tier; triggers must follow.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [i18n.language, tier]);

  return (
    <div className="relative text-fg">
      {immersive ? (
        <SceneBoundary onFail={disableScene}>
          <Suspense fallback={null}>
            <Scene tier={tier} onFail={disableScene} />
          </Suspense>
        </SceneBoundary>
      ) : (
        <div aria-hidden="true" className="scene-fallback" />
      )}
      {immersive && <div className="scene-scrim" />}
      <div className="grain" />
      <Header />
      <StatusBar />
      <ScrollRail />
      <main className="relative z-10">
        <Hero />
        <Process />
        <Automation />
        <Stack />
        <Work />
        <Contact immersive={immersive} />
      </main>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4">
        <Footer />
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Menú nuevo en `src/layout/Header.jsx`**

Reemplaza:

```js
const NAV_ITEMS = [
  { url: "#experience", label: "experience", icon: "las la-laptop" },
  { url: "#projects", label: "projects", icon: "las la-project-diagram" },
  { url: "#about", label: "about", icon: "las la-user" },
  { url: "mailto:andres03marquez@gmail.com", label: "contact", icon: "lar la-envelope" },
];
```

por:

```js
const NAV_ITEMS = [
  { url: "#process", label: "nav_process", icon: "las la-cogs" },
  { url: "#automation", label: "nav_ai", icon: "las la-robot" },
  { url: "#work", label: "nav_work", icon: "las la-laptop" },
  { url: "#contact", label: "contact", icon: "lar la-envelope" },
];
```

- [ ] **Step 10: `src/layout/StatusBar.jsx` completo (secciones nuevas; detección por banda central)**

```jsx
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "process", label: "Process" },
  { id: "automation", label: "AI" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export default function StatusBar() {
  const [section, setSection] = useState("Intro");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((e) => e.isIntersecting);
        const match = current && SECTIONS.find((s) => s.id === current.target.id);
        if (match) setSection(match.label);
      },
      // A zero-height band at mid-screen: works for sections taller than the
      // viewport (process is 600vh), where a ratio threshold never fires.
      { rootMargin: "-50% 0px -50% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-20 hidden md:top-20 md:block"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-end px-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fg/45">
        <div className="flex items-center gap-3">
          <span className="text-fg/70">{section}</span>
          <span aria-hidden className="h-px w-8 bg-fg/15" />
          <span className="tabular-nums text-fg/55">
            {progress.toFixed(0).padStart(2, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 11: Proyectos: sin Expresso ni Drive IAG, con los privados que enlazan a su caso**

`src/components/Projects.jsx` completo:

```jsx
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectIndex from "./ProjectIndex";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "kenk-nappford",
    title: "Kenk Napp Ford",
    year: "2026",
    urlProject: "https://www.kenknappford.com/",
    image: "images/kenk-nappford.png",
    categories: ["Website", "Vehicles"],
    featured: true,
  },
  // Private systems: no public URL, so they link to their case in the automation section.
  {
    id: "qsm-triple-s",
    title: "QSM · Triple-S",
    year: "2026",
    urlProject: "#case-qsm",
    categories: ["Automation", "n8n"],
  },
  {
    id: "mcontigo",
    title: "MContigo · Amazon ES/IT",
    year: "2026",
    urlProject: "#case-mcontigo",
    categories: ["Data", "Python"],
  },
  {
    id: "iag-group",
    title: "IAG Group",
    year: "2025",
    urlProject: "https://iagcanada.com/",
    image: "images/iag-group.png",
    categories: ["Website", "Vehicles"],
    featured: true,
  },
  {
    id: "gonorth",
    title: "Go North Surrey GM",
    year: "2024",
    urlProject: "https://gonorthsurreygm.ca/",
    image: "images/gonorth.png",
    categories: ["Website", "Vehicles"],
  },
  {
    id: "Leadbox",
    title: "Leadbox",
    year: "2024",
    urlProject: "https://leadboxhq.com/",
    image: "images/leadbox.png",
    categories: ["Website"],
    featured: true,
  },
  {
    id: "dropanas",
    title: "Dropanas",
    year: "2024",
    urlProject: "https://dropanas.com/",
    image: "images/dropanas.png",
    categories: ["Website", "E-commerce"],
  },
  {
    id: "vulister",
    title: "Vulister",
    year: "2022",
    urlProject: "https://www.vulistersgt.com/vulister/public/",
    image: "images/vulister.png",
    categories: ["Website", "Services"],
  },
  {
    id: "multiparadise",
    title: "Multiparadise",
    year: "2020",
    urlProject: "https://multiparadise.com/public/",
    image: "images/multiparadise.png",
    categories: ["Website", "Services"],
  },
];

export default function Projects() {
  const { t } = useTranslation();
  const rootRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-section-title]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
        });
        gsap.from("[data-project-card]", {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%", once: true },
        });
      }, rootRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="projects"
      data-section="projects"
      className="scroll-mt-24 pb-28"
    >
      <div className="mb-8">
        <h2
          data-section-title
          className="font-display text-3xl font-semibold tracking-tight text-fg md:text-5xl"
        >
          {t("title_projects")}
        </h2>
      </div>

      <ProjectIndex projects={PROJECTS} />
    </section>
  );
}
```

`src/components/ProjectIndex.jsx` completo:

```jsx
export default function ProjectIndex({ projects }) {
  return (
    <ul className="border-t border-fg/10">
      {projects.map((project, i) => {
        // "#case-…" links jump to a private case study on this page.
        const external = !project.urlProject.startsWith("#");
        return (
          <li key={project.id} data-project-card className="border-b border-fg/10">
            <a
              href={project.urlProject}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="group relative flex items-center gap-4 py-5 transition-colors hover:bg-fg/[0.03] md:py-7"
            >
              <span className="font-mono text-xs tabular-nums text-fg/35 transition-colors group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 truncate font-display text-2xl font-medium leading-tight text-fg/90 transition-colors group-hover:text-fg md:text-4xl">
                {project.title}
              </span>
              <span className="hidden font-mono text-[11px] uppercase tracking-widest text-fg/40 md:inline">
                {project.categories.join(" / ")}
              </span>
              <span className="font-mono text-xs tabular-nums text-fg/45">
                {project.year}
              </span>
              <span
                aria-hidden
                className="inline-block w-4 text-fg/30 transition-all group-hover:translate-x-1 group-hover:text-accent"
              >
                {external ? "↗" : "↓"}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 12: Borrar componentes sustituidos y claves heredadas**

```bash
git rm src/components/Presentation.jsx src/components/About.jsx src/assets/andresmarquez.jpg
```

En cada archivo de idioma, elimina el bloque heredado: empieza con la coma que sigue a `"english": "…"` y termina en la última clave antes de la `}` final.

`public/locales/es/lang.json`, bloque a eliminar (texto exacto):

```json
,

  "_legacy": "keys below are removed in task 5",
  "experience": "Experiencia",
  "projects": "Proyectos",
  "about": "Sobre mí",
  "text1": "+3 años de experiencia.",
  "text2": "Desarrollador Fullstack",
  "text3": "Desde Caracas, Venezuela",
  "text4": "Especializado en Laravel, Vue, React y Next.js",
  "about_title": "Sobre mí",
  "about_me": "Soy Andrés Márquez, desarrollador fullstack con más de 3 años de experiencia construyendo aplicaciones web modernas con Laravel, Vue.js y React. Profesional proactivo y autodidacta, con fuerte orientación a resultados y capacidad demostrada de adaptación a nuevas tecnologías. Tengo un historial comprobado de optimización de rendimiento, reducción de tiempos de carga y entrega de soluciones de alta calidad para clientes en Norteamérica y Europa. Si buscas un desarrollador apasionado, responsable y altamente eficaz, no dudes en contactarme.",
  "change_theme": "Cambiar tema"
```

`public/locales/en/lang.json`, bloque a eliminar (texto exacto):

```json
,

  "_legacy": "keys below are removed in task 5",
  "experience": "Experience",
  "projects": "Projects",
  "about": "About",
  "text1": "+3 years of experience.",
  "text2": "Fullstack Developer",
  "text3": "From Caracas, Venezuela",
  "text4": "Specialized in Laravel, Vue, React and Next.js",
  "about_title": "About me",
  "about_me": "I'm Andrés Márquez, a fullstack developer with 3+ years of experience building modern web applications with Laravel, Vue.js and React. Proactive and self-taught, results-driven and quick to adopt new technologies. Proven track record of performance optimization, load-time reduction and high-quality delivery for clients in North America and Europe. If you're looking for a passionate, reliable and highly effective developer, feel free to reach out.",
  "change_theme": "Change theme"
```

Tras borrarlos, ambos archivos terminan en `"english": "…"` seguido de `}`. Comprueba que son JSON válido:

Run: `node -e "for (const l of ['es','en']) JSON.parse(require('fs').readFileSync('public/locales/'+l+'/lang.json','utf8')); console.log('json ok')"`
Expected: `json ok`.

- [ ] **Step 13: Verificar**

Run: `npm run lint && npm run check && npm run build`
Expected: los tres PASS.

Run: `npm run dev`. Expected en http://localhost:5173:
- Hero con "Diseño. / Desarrollo. / Automatizo." (o "I design. / I develop. / I automate." en inglés), la frase del proceso y cinco etiquetas.
- Menú: Proceso, IA, Trabajo, Contacto; el botón de idioma tiene el mismo tamaño que ellos.
- Proceso: seis tarjetas en dos columnas, sin panel pegado ni scroll extra.
- IA: cuatro tarjetas con icono; cinco casos con filas Problema / Solución / Resultado y etiquetas de herramientas diminutas.
- Stack: etiquetas pequeñas; "Formándome ahora" lista NestJS y Node.js.
- Trabajo: panel casi opaco; la lista de proyectos ya no tiene Expresso ni Drive IAG y sí QSM · Triple-S y MContigo.
- La barra de estado (arriba a la derecha) muestra Process, AI, Stack, Work y Contact a su paso.
- El texto ocupa la izquierda en escritorio (~58 %); la derecha queda libre.
- `?tier=off`: no hay canvas; Contacto no es sticky.
- Emulación móvil 390×844: todo en una columna, paneles oscuros bajo el texto.

- [ ] **Step 14: Comprobar que las claves de traducción existen**

Run: `node -e "const fs=require('fs');const src=['src/sections','src/components','src/layout'].flatMap(d=>fs.readdirSync(d).map(f=>d+'/'+f)).filter(f=>/\.jsx$/.test(f)).map(f=>fs.readFileSync(f,'utf8')).join('\n');const keys=[...src.matchAll(/\bt\(\s*[\"']([\w.]+)[\"']/g)].map(m=>m[1]);const es=JSON.parse(fs.readFileSync('public/locales/es/lang.json','utf8'));const en=JSON.parse(fs.readFileSync('public/locales/en/lang.json','utf8'));const miss=[...new Set(keys)].filter(k=>!(k in es)||!(k in en));console.log(miss.length?'MISSING '+miss.join(', '):'all static keys present in es and en');"`
Expected: `all static keys present in es and en`. (Las claves dinámicas como `process_step${n}_title` no se detectan aquí; el paso 13 las revisa a ojo.)

- [ ] **Step 15: Review Focus 1 — idioma a mitad de página**

Aparca en la sección IA y cambia el idioma con el selector.
Expected: tras el cambio, la barra de estado sigue en "AI", la cámara no salta y no hay saltos de sección.

- [ ] **Step 16: Review Focus 2 — anclas**

Pulsa cada enlace del menú (Proceso, IA, Trabajo, Contacto) y, en la lista de proyectos, "QSM · Triple-S".
Expected: cada enlace aterriza en su sección; QSM aterriza en la tarjeta `#case-qsm`; la cámara alcanza la estación y en un par de segundos las líneas de velocidad desaparecen.

- [ ] **Step 17: Commit**

```bash
git add -A src public/images/andres.jpg public/locales
git commit -m "$(cat <<'EOF'
feat: rebuild the page around the build-process journey

Hero with the three verbs, a compact six-phase process, a clearer AI
workshop and real automation cases, grouped stack, work and contact
sections in a text column that leaves the right side to the ship. Each
section publishes its scroll progress to the scene; private projects link
to their case; Expresso and Drive IAG are gone.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: El cohete de partículas y el retrato final

**Files:**
- Create: `src/scene/shipGeometry.js`, `src/scene/Ship.jsx`
- Modify: `src/scene/Scene.jsx`

**Interfaces:**
- Consumes: `journey`; `flybys`, `plumeLength` (`flight.js`); `mulberry32`, `routePosition`, `sampleLuminance`, `SECTION_IDS`, `smoothstep` (`math.js`); `PLANETS`; `aheadU`, `cruiseOffset`, `ROUTE`, `shipLead`, `stageOffset`, `stageScale` (`route.js`); `glowPointFragment` (`shaders.js`); `/images/andres.jpg` (Tarea 5).
- Produces: `buildHullParts()`, `buildHullParticles(parts, count) → { position, color, seed }`, `NOZZLE_Z`, `NOZZLE_RING` (`shipGeometry.js`); `<Ship hullParticles plumeParticles />`.

- [ ] **Step 1: `src/scene/shipGeometry.js`**

```js
import {
  Color, CylinderGeometry, ExtrudeGeometry, Float32BufferAttribute, LatheGeometry, Mesh, Shape,
  TorusGeometry, Vector2, Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { mulberry32 } from "./math";

// Launch vehicle used only as a surface to scatter particles on. Modelled in
// Y-up units (nose toward +Y), then turned so the nose points at -Z, the
// direction of flight. ~8.5 units long.
export const NOZZLE_Z = 3.95; // where the exhaust starts, in the flight frame
export const NOZZLE_RING = 0.28; // radius of the three-engine cluster
const NOSE_Z = -4.6;

const AMBER = new Color("#FCD34D");
const WARM = new Color("#ffe9a8");
const BLUE = new Color("#4F8CFF");

const lathe = (points) => new LatheGeometry(points.map(([r, y]) => new Vector2(r, y)), 48);

// Von Karman nose cone: the smoothest ogive for a supersonic rocket.
function noseProfile(radius, baseY, length, steps = 18) {
  const points = [];
  for (let i = steps; i >= 0; i--) {
    const x = (length * i) / steps; // distance from the tip
    const theta = Math.acos(1 - (2 * x) / length);
    points.push([radius * Math.sqrt((theta - Math.sin(2 * theta) / 2) / Math.PI), baseY + length - x]);
  }
  return points;
}

function fin(angle) {
  const shape = new Shape();
  shape.moveTo(0.6, -1.4);
  shape.lineTo(1.55, -3.25);
  shape.lineTo(1.55, -3.55);
  shape.lineTo(0.6, -3.3);
  shape.closePath();
  return new ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: false }).translate(0, 0, -0.035).rotateY(angle);
}

// `kind` decides the particle colour: "body" fades warm -> blue along the
// hull, "accent" stays amber (nose, bands), "fin" is blue.
export function buildHullParts() {
  const parts = [];
  const add = (name, geometry, kind) => parts.push({ name, geometry, kind });

  add("core", lathe([[0.01, -3.35], [0.7, -3.35], [0.74, -3.3], [0.74, -2.75], [0.62, -2.6], [0.62, 1.9]]), "body");
  add("nose", lathe(noseProfile(0.62, 1.9, 2.7)), "accent");
  for (const y of [-0.7, 0.55, 1.9]) {
    add(`band${y}`, new TorusGeometry(0.625, 0.03, 8, 48).rotateX(Math.PI / 2).translate(0, y, 0), "accent");
  }
  for (const side of [-1, 1]) {
    const x = side * 1.0;
    add(`booster${side}`, lathe([[0.01, -3.0], [0.2, -3.0], [0.27, -2.8], [0.27, 1.7]]).translate(x, 0, 0), "body");
    add(`booster-nose${side}`, lathe(noseProfile(0.27, 1.7, 1.1, 12)).translate(x, 0, 0), "accent");
  }
  for (let k = 0; k < 4; k++) add(`fin${k}`, fin(Math.PI / 4 + (k * Math.PI) / 2), "fin");
  for (let k = 0; k < 3; k++) {
    const a = Math.PI / 2 + (k * Math.PI * 2) / 3;
    add(
      `bell${k}`,
      new CylinderGeometry(0.13, 0.3, 0.6, 24, 1, true).translate(Math.cos(a) * NOZZLE_RING, -3.65, Math.sin(a) * NOZZLE_RING),
      "fin"
    );
  }
  // Y-up (nose +Y) -> flight frame (nose -Z): (x, y, z) -> (x, z, -y).
  for (const part of parts) part.geometry.rotateX(-Math.PI / 2);
  return parts;
}

// Particle skin of the whole hull: every point takes its part's colour, is
// shaded by a fixed key light so the cloud reads as a solid volume, and the
// body fades from warm at the nose to blue at the engines.
export function buildHullParticles(parts, count) {
  const rng = mulberry32(42);
  const geometries = parts.map((part) => {
    const geometry = part.geometry.clone().toNonIndexed();
    for (const name of Object.keys(geometry.attributes)) {
      if (name !== "position" && name !== "normal") geometry.deleteAttribute(name);
    }
    const kind = { body: 0, accent: 1, fin: 2 }[part.kind];
    geometry.setAttribute("color", new Float32BufferAttribute(new Float32Array(geometry.attributes.position.count * 3).fill(kind), 3));
    return geometry;
  });
  const sampler = new MeshSurfaceSampler(new Mesh(mergeGeometries(geometries))).setRandomGenerator(rng).build();

  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const p = new Vector3();
  const n = new Vector3();
  const tag = new Color();
  const c = new Color();
  const key = new Vector3(-0.5, 0.7, 0.6).normalize();

  for (let i = 0; i < count; i++) {
    seed[i] = rng();
    sampler.sample(p, n, tag);
    const along = (p.z - NOSE_Z) / (NOZZLE_Z - NOSE_Z); // 0 at the nose, 1 at the engines
    if (tag.r < 0.5) c.copy(WARM).lerp(BLUE, along); // body
    else if (tag.r < 1.5) c.copy(AMBER); // accent
    else c.copy(BLUE); // fin
    c.multiplyScalar(0.55 + 0.9 * Math.max(0, n.dot(key)));
    p.addScaledVector(n, rng() < 0.08 ? 0.05 + rng() * 0.2 : 0.02);
    p.toArray(position, i * 3);
    c.toArray(color, i * 3);
  }
  return { position, color, seed };
}
```

- [ ] **Step 2: `src/scene/Ship.jsx`**

```jsx
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

    // R3F copies the \`uniforms\` props into the materials: write to the materials' own.
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
      <points ref={skin} frustumCulled={false}>
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
      <points ref={plume} frustumCulled={false}>
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
```

- [ ] **Step 3: Montar el cohete en `src/scene/Scene.jsx`**

Reemplaza `import Stars from "./Stars";` por:

```jsx
import Stars from "./Stars";
import Ship from "./Ship";
```

Reemplaza `        <Stars count={quality.stars} />` por:

```jsx
        <Stars count={quality.stars} />
        <Ship hullParticles={quality.hullParticles} plumeParticles={quality.plume} />
```

- [ ] **Step 4: Verificar build**

Run: `npm run lint && npm run check && npm run build`
Expected: los tres PASS.

- [ ] **Step 5: Verificar en navegador (1440×900)**

Expected:
- Hero: cohete de partículas en diagonal a la derecha, con la nariz ámbar, bandas ámbar, cuerpo blanco-crema, aletas y cola azules; se distinguen la ogiva, los propulsores y las aletas. Cola de escape corta y suave.
- Al bajar, el cohete se adelanta a la cámara y vuela por la derecha del texto durante **todas** las secciones, sin quedar tapado por los paneles.
- Contacto: las partículas se reordenan y forman la cara, el pelo y el colgante (el fondo de la foto no aparece).
- Consola sin errores de shader.

- [ ] **Step 6: Comprobar el aspecto de partículas, no realista**

Run: `grep -rn "MeshStandardMaterial\|DirectionalLight\|ambientLight" src/scene`
Expected: sin resultados (el cohete es solo partículas).

- [ ] **Step 7: Review Focus 3 — viewport estrecho**

Con el hero visible, emula 390×844 (o estrecha la ventana).
Expected: el cohete pasa a la parte superior, más pequeño, encima del texto, sin tapar el titular ni las etiquetas.

- [ ] **Step 8: Review Focus 5 — foto ausente**

Renombra temporalmente `public/images/andres.jpg` a `andres.bak.jpg`, recarga y baja hasta Contacto.
Expected: el cohete llega a Contacto y sigue siendo cohete; en consola solo aparece el 404 de la imagen.
Devuelve el nombre original.

- [ ] **Step 9: Commit**

```bash
git add src/scene/shipGeometry.js src/scene/Ship.jsx src/scene/Scene.jsx
git commit -m "$(cat <<'EOF'
feat(scene): add the particle rocket that becomes the portrait

A launch vehicle (von Karman nose, boosters, fins, three engines) built
from glowing particles, amber at the nose and blue at the engines, with a
soft exhaust. It flies ahead of the camera on the right of the text,
banks away from planets and, at contact, rebuilds Andres's portrait from
the photo's luminance.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Dos planetas grandes, polvo y líneas de velocidad

**Files:**
- Create: `src/scene/textures.js`, `src/scene/Nebula.jsx`, `src/scene/Streaks.jsx`, `src/scene/Planets.jsx`
- Modify: `src/scene/Scene.jsx`

**Interfaces:**
- Consumes: `journey`; `PLANETS`; `fibonacciSphere`, `mulberry32`, `routePosition`, `smoothstep` (`math.js`); `streakAlpha`, `streakLength` (`flight.js`); `ROUTE`, `planetOffset`, `uAtZ` (`route.js`); `planetPointFragment` (`shaders.js`).
- Produces: `dotTexture()` (`textures.js`); `<Nebula count />`, `<Streaks count />`, `<Planets bodyPoints ringPoints />`.

- [ ] **Step 1: `src/scene/textures.js`**

```js
import { CanvasTexture } from "three";

// Soft round sprite for PointsMaterial, so points don't render as squares.
export function dotTexture() {
  const canvas = Object.assign(document.createElement("canvas"), { width: 64, height: 64 });
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.35)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
}
```

- [ ] **Step 2: `src/scene/Nebula.jsx`**

```jsx
import { useMemo } from "react";
import { AdditiveBlending, Color, Vector3 } from "three";
import { mulberry32 } from "./math";
import { ROUTE } from "./route";
import { dotTexture } from "./textures";

// Where the dust clouds hang: route parameter, offset from the flight line
// (always off to the right/back, away from the text) and colour.
const CLOUDS = [
  { u: 0.52, offset: [20, 5, -28], radius: 13, color: "#4F8CFF" },
  { u: 0.7, offset: [24, 0, -30], radius: 15, color: "#FCD34D" },
  { u: 0.88, offset: [21, 3, -28], radius: 14, color: "#4F8CFF" },
];

const gaussian = (rng) => (rng() + rng() + rng() - 1.5) / 1.5; // roughly -1..1, bell shaped

// Large, very faint additive sprites that give depth to the empty space
// between planets.
export default function Nebula({ count }) {
  const map = useMemo(dotTexture, []);
  const [positions, colors] = useMemo(() => {
    const rng = mulberry32(31);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const centre = new Vector3();
    const c = new Color();
    for (let i = 0; i < count; i++) {
      const cloud = CLOUDS[i % CLOUDS.length];
      ROUTE.getPoint(cloud.u, centre);
      pos[i * 3] = centre.x + cloud.offset[0] + gaussian(rng) * cloud.radius;
      pos[i * 3 + 1] = centre.y + cloud.offset[1] + gaussian(rng) * cloud.radius * 0.5;
      pos[i * 3 + 2] = centre.z + cloud.offset[2] + gaussian(rng) * cloud.radius;
      c.set(cloud.color).multiplyScalar(0.5 + rng() * 0.5).toArray(col, i * 3);
    }
    return [pos, col];
  }, [count]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={9}
        map={map}
        vertexColors
        transparent
        opacity={0.03}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 3: `src/scene/Streaks.jsx`**

```jsx
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
```

- [ ] **Step 4: `src/scene/Planets.jsx`**

```jsx
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color, NormalBlending, ShaderMaterial, Vector3 } from "three";
import { journey } from "./journey";
import { fibonacciSphere, mulberry32, routePosition, smoothstep } from "./math";
import { PLANETS } from "./planetData";
import { ROUTE, planetOffset, uAtZ } from "./route";
import { planetPointFragment } from "./shaders";
import { dotTexture } from "./textures";

// Palettes inside the site's amber / blue identity.
const KINDS = {
  gas: { a: "#9a4a08", b: "#FCD34D", c: "#fff1c2", bands: 14, rim: "#ffd978" },
  giant: { a: "#0d2260", b: "#3a6ee0", c: "#9ec1ff", bands: 11, rim: "#6fa0ff" },
};
const SUN = new Vector3(-0.8, 0.3, 0.55).normalize(); // light comes from the flight line's side
const RING = { inner: 1.35, outer: 1.75 }; // in planet radii
// Point size relative to the spacing between points. Below 1 on purpose: many
// small points with hairline gaps read as fine glitter, not as big dots.
const COVERAGE = 0.8;
const MAX_POINT_PX = 6; // hard cap at the closest flyby

// Planet surface points are sized from how many of them cover the visible
// hemisphere, so the globe looks solid at any distance or resolution.
const bodyVertex = /* glsl */ `
  uniform float uF;        // pixels per world unit at distance 1
  uniform float uSpacing;  // world distance between neighbouring points
  uniform float uReveal;
  uniform vec3 uSun;
  uniform float uSolid;    // 1 for the globe (hides its far side), 0 for the ring
  attribute vec3 aColor;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * world;
    vec3 normal = normalize(mat3(modelMatrix) * position);
    vec3 view = normalize(cameraPosition - world.xyz);
    float facing = dot(normal, view);
    float lit = clamp(dot(normal, uSun), 0.0, 1.0);
    float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 2.5);
    float shade = mix(1.0, 0.16 + 0.84 * smoothstep(0.0, 0.6, lit), uSolid);
    vColor = aColor * shade + vec3(0.85, 0.92, 1.0) * rim * 0.3 * (0.3 + lit) * uSolid;
    float side = mix(1.0, mix(0.06, 1.0, smoothstep(-0.12, 0.2, facing)), uSolid);
    float dist = length(cameraPosition - world.xyz);
    vAlpha = side * smoothstep(260.0, 120.0, dist) * uReveal;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(${COVERAGE.toFixed(2)} * uSpacing * uF * (0.8 + 0.4 * fract(aSeed * 91.7)) / -mv.z, 1.0, ${MAX_POINT_PX.toFixed(1)});
  }
`;

const reveal = { value: 0 }; // shared: the sky stays planet-free until the journey starts

// A real ShaderMaterial instance (not JSX props): R3F would copy the uniforms
// and the per-frame writes below would never reach the material.
function bodyMaterial(spacing, solid, blending) {
  return new ShaderMaterial({
    vertexShader: bodyVertex,
    fragmentShader: planetPointFragment,
    uniforms: { uF: { value: 1000 }, uSpacing: { value: spacing }, uReveal: reveal, uSun: { value: SUN }, uSolid: { value: solid } },
    transparent: true,
    depthWrite: false,
    blending,
  });
}

// Latitude bands bent by a little noise, with lighter "cloud" patches.
function surfaceColors(unit, kind, rng) {
  const k = KINDS[kind];
  const count = unit.length / 3;
  const colors = new Float32Array(count * 3);
  const a = new Color(k.a);
  const b = new Color(k.b);
  const c = new Color(k.c);
  const mix = new Color();
  for (let i = 0; i < count; i++) {
    const x = unit[i * 3];
    const y = unit[i * 3 + 1];
    const z = unit[i * 3 + 2];
    const warp = Math.sin(x * 3.1 + z * 2.7) * 0.5 + Math.sin(y * 7.3 + x * 5.1) * 0.25;
    const bands = Math.sin((y + warp * 0.12) * k.bands) * 0.5 + 0.5;
    const patch = Math.sin(x * 9 + y * 4) * Math.sin(z * 8 - y * 6);
    mix.copy(a).lerp(b, bands).lerp(c, Math.max(0, patch - 0.45) * 0.9);
    mix.multiplyScalar(0.85 + rng() * 0.3).toArray(colors, i * 3);
  }
  return colors;
}

function buildPlanet(planet, bodyCount, ringCount, index) {
  const rng = mulberry32(100 + index);
  const unit = fibonacciSphere(bodyCount);
  const position = new Float32Array(unit.length);
  for (let i = 0; i < unit.length; i++) position[i] = unit[i] * planet.radius * (1 + (rng() - 0.5) * 0.008);
  const seed = new Float32Array(bodyCount).map(() => rng());
  const body = { position, color: surfaceColors(unit, planet.kind, rng), seed };

  let ring = null;
  if (planet.ring && ringCount > 0) {
    const k = KINDS[planet.kind];
    const pos = new Float32Array(ringCount * 3);
    const col = new Float32Array(ringCount * 3);
    const sd = new Float32Array(ringCount);
    const dark = new Color(k.a).multiplyScalar(1.3);
    const light = new Color(k.c);
    const c = new Color();
    for (let i = 0; i < ringCount; i++) {
      let t;
      let stripes;
      do {
        t = rng();
        stripes = 0.5 + 0.5 * Math.sin(t * 60 + Math.sin(t * 17) * 2);
      } while (rng() > 0.25 + 0.75 * stripes);
      const radius = planet.radius * (RING.inner + t * (RING.outer - RING.inner));
      const angle = rng() * Math.PI * 2;
      pos.set([Math.cos(angle) * radius, (rng() - 0.5) * planet.radius * 0.015, Math.sin(angle) * radius], i * 3);
      c.copy(dark).lerp(light, stripes).multiplyScalar(0.8 + rng() * 0.4).toArray(col, i * 3);
      sd[i] = rng();
    }
    ring = { position: pos, color: col, seed: sd };
  }
  // Spacing between points: the visible half of the globe holds half the points.
  const bodySpacing = planet.radius * Math.sqrt((4 * Math.PI) / bodyCount);
  const ringArea = Math.PI * (RING.outer ** 2 - RING.inner ** 2) * planet.radius ** 2;
  return { planet, u: uAtZ(planet.z), body, ring, bodySpacing, ringSpacing: Math.sqrt(ringArea / Math.max(1, ringCount)) };
}

// The two planets of the flight, made of the same glowing particles as the
// ship: a banded globe, a halo and, for the first one, a particle ring.
export default function Planets({ bodyPoints, ringPoints }) {
  const aspect = useThree((s) => s.viewport.aspect);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const groups = useRef([]);
  const spins = useRef([]);
  const offset = useMemo(() => new Vector3(), []);
  const halo = useMemo(dotTexture, []);
  const built = useMemo(() => PLANETS.map((planet, i) => buildPlanet(planet, bodyPoints, ringPoints, i)), [bodyPoints, ringPoints]);
  const materials = useMemo(
    () => built.map((b) => ({ body: bodyMaterial(b.bodySpacing, 1, NormalBlending), ring: bodyMaterial(b.ringSpacing, 0, AdditiveBlending) })),
    [built]
  );

  useFrame(({ camera, clock }) => {
    reveal.value = smoothstep(0.1, 0.6, routePosition(journey.section));
    const pixelsPerUnit = (size.height * gl.getPixelRatio()) / (2 * Math.tan((camera.fov * Math.PI) / 360));
    built.forEach(({ planet, u }, i) => {
      const group = groups.current[i];
      group.visible = reveal.value > 0.005;
      if (!group.visible) return;
      ROUTE.getPoint(u, group.position).add(planetOffset(planet, aspect, offset));
      group.scale.setScalar(aspect >= 1 ? 1 : 0.6);
      spins.current[i].rotation.y = clock.elapsedTime * 0.03;
      materials[i].body.uniforms.uF.value = pixelsPerUnit;
      materials[i].ring.uniforms.uF.value = pixelsPerUnit;
    });
  });

  return (
    <>
      {built.map(({ planet, body, ring }, i) => (
        <group key={planet.id} ref={(node) => { groups.current[i] = node; }}>
          <points renderOrder={1} frustumCulled={false}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[new Float32Array(3), 3]} />
            </bufferGeometry>
            <pointsMaterial size={planet.radius * 7.2} map={halo} color={KINDS[planet.kind].rim} transparent opacity={0.22} depthWrite={false} blending={AdditiveBlending} />
          </points>
          <group ref={(node) => { spins.current[i] = node; }}>
            <points renderOrder={2}>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[body.position, 3]} />
                <bufferAttribute attach="attributes-aColor" args={[body.color, 3]} />
                <bufferAttribute attach="attributes-aSeed" args={[body.seed, 1]} />
              </bufferGeometry>
              <primitive object={materials[i].body} attach="material" />
            </points>
          </group>
          {ring && (
            <points rotation={[0.38, 0, 0.28]} renderOrder={3}>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[ring.position, 3]} />
                <bufferAttribute attach="attributes-aColor" args={[ring.color, 3]} />
                <bufferAttribute attach="attributes-aSeed" args={[ring.seed, 1]} />
              </bufferGeometry>
              <primitive object={materials[i].ring} attach="material" />
            </points>
          )}
        </group>
      ))}
    </>
  );
}
```

- [ ] **Step 5: Montar en `src/scene/Scene.jsx`**

Reemplaza `import Stars from "./Stars";` por:

```jsx
import Stars from "./Stars";
import Nebula from "./Nebula";
import Streaks from "./Streaks";
import Planets from "./Planets";
```

Reemplaza `        <Stars count={quality.stars} />` por:

```jsx
        <Stars count={quality.stars} />
        <Nebula count={quality.nebula} />
        {quality.streaks > 0 && <Streaks count={quality.streaks} />}
        <Planets bodyPoints={quality.planetPoints} ringPoints={quality.ringPoints} />
```

- [ ] **Step 6: Verificar build**

Run: `npm run lint && npm run check && npm run build`
Expected: los tres PASS.

- [ ] **Step 7: Verificar en navegador (1440×900)**

Expected:
- Consola sin `Shader Error`.
- Hero limpio: ningún planeta a la vista en scroll 0.
- Sección IA: un planeta de partículas ámbar con anillo entra por la derecha; el cohete lo bordea por su lado izquierdo, se inclina y se aparta un poco, y la cámara lo mira de reojo.
- Sección Trabajo (inicio): un segundo planeta azul con bandas entra por la derecha.
- Los puntos de los planetas se ven **finos** (grano, no puntos gordos), también en la pasada más cercana.
- Ningún elemento (cohete, planeta, retrato) ocupa más de una cuarta parte de la pantalla a 1440×900: mira la pasada más cercana de cada planeta y el retrato de Contacto.
- Solo hay esos dos planetas en todo el viaje; no hay asteroides, anillos de estaciones ni engranajes.
- Un scroll rápido hace aparecer, tenues, las líneas de velocidad y abre un poco el campo de visión; al parar se calman.
- El texto de la izquierda se lee bien en todas las secciones, incluida Trabajo.

- [ ] **Step 8: Review Focus 3 — viewport estrecho**

Aparcado en la sección IA, emula 390×844.
Expected: el planeta pasa arriba y a la derecha, más pequeño, y las tarjetas de texto mantienen el contraste.

- [ ] **Step 9: Commit**

```bash
git add src/scene/textures.js src/scene/Nebula.jsx src/scene/Streaks.jsx src/scene/Planets.jsx src/scene/Scene.jsx
git commit -m "$(cat <<'EOF'
feat(scene): add two big particle planets, faint dust and speed lines

Two planets built from the same glowing particles as the rocket: an amber
ringed gas giant during the AI section and a blue banded giant during
work. A few faint dust clouds and speed lines that only show when
scrolling fast.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Constelaciones del stack

**Files:**
- Create: `src/scene/StackField.jsx`
- Modify: `src/scene/Scene.jsx`

**Interfaces:**
- Consumes: `STACK_GROUPS` (`content.js`); `journey`; `constellationLayout`, `mulberry32`, `nearStation`, `routePosition` (`math.js`); `ROUTE`, `stageOffset`, `stageScale`, `stationU` (`route.js`); `dotTexture` (`textures.js`).
- Produces: `<StackField />`.

- [ ] **Step 1: `src/scene/StackField.jsx`**

```jsx
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";
import { STACK_GROUPS } from "../data/content";
import { journey } from "./journey";
import { constellationLayout, mulberry32, routePosition, SECTION_IDS } from "./math";
import { ROUTE, stageOffset, stageScale } from "./route";
import { dotTexture } from "./textures";

const STACK_MID = SECTION_IDS.indexOf("stack") + 0.5; // route position halfway through the stack section
const TINTS = [new Color("#FCD34D"), new Color("#4F8CFF")];

// One small constellation per stack group. Deliberately quiet: the stack is
// supporting cast, the process is the story.
export default function StackField() {
  const group = useRef(null);
  const aspect = useThree((s) => s.viewport.aspect);
  // The camera flies continuously, so the piece sits where the camera is in the
  // MIDDLE of the stack section (route position 3.5), not at the station that
  // marks the section's start.
  const station = useMemo(() => ROUTE.getPoint(STACK_MID / (SECTION_IDS.length - 1)), []);
  const dot = useMemo(dotTexture, []);

  const { positions, colors, lines } = useMemo(() => {
    const { stars, segments } = constellationLayout(
      STACK_GROUPS.map((g) => g.items.length),
      mulberry32(9)
    );
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 3);
    stars.forEach((star, i) => {
      positions.set([star.x, star.y, star.z], i * 3);
      TINTS[star.group % 2].toArray(colors, i * 3);
    });
    const lines = new Float32Array(segments.length * 6);
    segments.forEach(([a, b], i) => {
      lines.set(positions.subarray(a * 3, a * 3 + 3), i * 6);
      lines.set(positions.subarray(b * 3, b * 3 + 3), i * 6 + 3);
    });
    return { positions, colors, lines };
  }, []);

  useFrame(({ clock }) => {
    group.current.visible = Math.abs(routePosition(journey.section) - STACK_MID) < 1.1;
    if (!group.current.visible) return;
    stageOffset("stack", aspect, group.current.position).add(station);
    group.current.scale.setScalar(stageScale(aspect));
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.1) * 0.25;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.5} map={dot} vertexColors transparent depthWrite={false} toneMapped={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#8a8aa0" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}
```

- [ ] **Step 2: Montar en `src/scene/Scene.jsx`**

Reemplaza `import Ship from "./Ship";` por:

```jsx
import Ship from "./Ship";
import StackField from "./StackField";
```

Reemplaza `        <Ship hullParticles={quality.hullParticles} plumeParticles={quality.plume} />` por:

```jsx
        <Ship hullParticles={quality.hullParticles} plumeParticles={quality.plume} />
        <StackField />
```

`src/scene/Scene.jsx` debe quedar así:

```jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Vector2 } from "three";
import { journey } from "./journey";
import { QUALITY } from "./quality";
import CameraRig from "./CameraRig";
import Stars from "./Stars";
import Nebula from "./Nebula";
import Streaks from "./Streaks";
import Planets from "./Planets";
import Ship from "./Ship";
import StackField from "./StackField";

const BACKGROUND = "#07070a";

// Cinematic grade: bloom for the glow, a soft vignette, and a hair of colour
// fringing that grows with speed (kept tiny on purpose).
function Post() {
  const aberration = useRef(null);
  const offset = useMemo(() => new Vector2(0, 0), []);
  useFrame(() => {
    // none at rest: at 1px stars, any fringing turns them into red/blue confetti
    const amount = journey.speed * 0.0007;
    aberration.current?.offset.set(amount, amount);
  });
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur luminanceThreshold={0.7} luminanceSmoothing={0.25} intensity={0.85} />
      <Vignette eskil={false} offset={0.25} darkness={0.7} />
      <ChromaticAberration ref={aberration} offset={offset} radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  );
}

// Fixed, decorative canvas behind the page. All text lives in the DOM.
export default function Scene({ tier, onFail }) {
  const quality = QUALITY[tier];
  const [visible, setVisible] = useState(() => !document.hidden);

  // Hidden tab: stop rendering instead of burning GPU in the background.
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, quality.maxDpr]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 45, near: 0.1, far: 500, position: [0, 0.6, 14] }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
        }}
      >
        <color attach="background" args={[BACKGROUND]} />
        <CameraRig />
        <Stars count={quality.stars} />
        <Nebula count={quality.nebula} />
        {quality.streaks > 0 && <Streaks count={quality.streaks} />}
        <Planets bodyPoints={quality.planetPoints} ringPoints={quality.ringPoints} />
        <Ship hullParticles={quality.hullParticles} plumeParticles={quality.plume} />
        <StackField />
        {quality.post && <Post />}
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Verificar**

Run: `npm run lint && npm run check && npm run build`
Expected: los tres PASS.

Run: `npm run dev`. Expected: en la sección Stack aparecen, a la derecha, cinco constelaciones pequeñas de puntos redondos unidas por líneas tenues; no se ven desde el hero ni desde Trabajo.

- [ ] **Step 4: Commit**

```bash
git add src/scene/StackField.jsx src/scene/Scene.jsx
git commit -m "$(cat <<'EOF'
feat(scene): add quiet stack constellations

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: SEO y verificación final

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `public/images/andres.jpg` (imagen de Open Graph).
- Produces: metadatos y JSON-LD con el nuevo posicionamiento.

- [ ] **Step 1: Título, descripción y keywords**

Reemplaza:

```html
    <title>Andrés Márquez · Fullstack Developer · Laravel, React, Vue, Next.js</title>
    <meta
      name="description"
      content="Andrés Márquez — Fullstack Developer con +3 años construyendo aplicaciones web modernas con Laravel, Vue, React y Next.js. Optimización de rendimiento y entregas de alta calidad para clientes en Norteamérica y Europa."
    />
    <meta
      name="keywords"
      content="Andrés Márquez, andres marquez, fullstack developer, desarrollador fullstack, laravel developer, react developer, vue developer, next.js, programador web, portfolio, portafolio, Caracas, remote developer"
```

por:

```html
    <title>Andrés Márquez · Fullstack Developer & Automation Engineer</title>
    <meta
      name="description"
      content="Andrés Márquez — desarrollador fullstack e ingeniero de automatización. Así construyo software: proceso, IA y automatizaciones con n8n, Zapier, GoHighLevel y Python, sobre Laravel, React, Next.js y Angular."
    />
    <meta
      name="keywords"
      content="Andrés Márquez, andres marquez, fullstack developer, automation engineer, desarrollador fullstack, automatizaciones, n8n, zapier, gohighlevel, python, laravel, react, next.js, angular, three.js, portafolio, Caracas, remote developer"
```

- [ ] **Step 2: Open Graph**

Reemplaza:

```html
    <meta property="og:title" content="Andrés Márquez · Fullstack Developer" />
    <meta
      property="og:description"
      content="Fullstack Developer con +3 años en Laravel, Vue, React y Next.js. Optimización de rendimiento y entregas de alta calidad."
    />
    <meta property="og:url" content="https://andresmarquez02.github.io/" />
    <meta property="og:image" content="https://andresmarquez02.github.io/images/andres_icon.png" />
    <meta property="og:image:alt" content="Andrés Márquez · Fullstack Developer" />
```

por:

```html
    <meta property="og:title" content="Andrés Márquez · Fullstack Developer & Automation Engineer" />
    <meta
      property="og:description"
      content="Cómo construyo software: proceso, IA y automatización. Laravel, React, Next.js, Angular, n8n, GoHighLevel y Python."
    />
    <meta property="og:url" content="https://andresmarquez02.github.io/" />
    <meta property="og:image" content="https://andresmarquez02.github.io/images/andres.jpg" />
    <meta property="og:image:alt" content="Retrato de Andrés Márquez" />
```

- [ ] **Step 3: Twitter**

Reemplaza:

```html
    <meta name="twitter:title" content="Andrés Márquez · Fullstack Developer" />
    <meta
      name="twitter:description"
      content="Fullstack Developer con +3 años en Laravel, Vue, React y Next.js."
    />
    <meta name="twitter:image" content="https://andresmarquez02.github.io/images/andres_icon.png" />
```

por:

```html
    <meta name="twitter:title" content="Andrés Márquez · Fullstack Developer & Automation Engineer" />
    <meta
      name="twitter:description"
      content="Cómo construyo software: proceso, IA y automatización."
    />
    <meta name="twitter:image" content="https://andresmarquez02.github.io/images/andres.jpg" />
```

- [ ] **Step 4: JSON-LD**

Reemplaza:

```json
        "image": "https://andresmarquez02.github.io/images/andres_icon.png",
        "jobTitle": "Fullstack Developer",
        "description": "Fullstack Developer con +3 años de experiencia en Laravel, Vue, React y Next.js.",
        "knowsAbout": ["Laravel", "PHP", "Vue.js", "React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "MySQL"],
```

por:

```json
        "image": "https://andresmarquez02.github.io/images/andres.jpg",
        "jobTitle": "Fullstack Developer & Automation Engineer",
        "description": "Desarrollador fullstack e ingeniero de automatización: proceso, IA y automatizaciones sobre Laravel, React, Next.js y Angular.",
        "knowsAbout": ["Laravel", "PHP", "Vue.js", "React", "Next.js", "Angular", "TypeScript", "Tailwind CSS", "PostgreSQL", "MySQL", "n8n", "Zapier", "GoHighLevel", "Python", "pandas", "Three.js"],
```

- [ ] **Step 5: Validar el JSON-LD**

Run: `node -e "const s=require('fs').readFileSync('index.html','utf8');JSON.parse(s.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/)[1]);console.log('json-ld ok')"`
Expected: `json-ld ok`.

- [ ] **Step 6: Verificación completa**

Run: `npm run lint && npm run check && npm run build`
Expected: los tres PASS.

Run: `npm run preview` (http://localhost:4173) y revisa:
- `?tier=high`, `?tier=low` y `?tier=off`: las tres versiones cargan sin errores en consola (salvo el aviso de `THREE.Clock`). En `low` no hay Bloom ni líneas de velocidad y la escena sigue siendo la misma, con menos partículas.
- DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" y recarga: versión estática, sin canvas.
- Navegación con teclado: Tab recorre el menú, el selector de idioma y los enlaces de contacto con foco visible.
- Recorre la página de arriba abajo y de abajo arriba: el cohete vuela todo el tiempo, los dos planetas pasan por la derecha y nada tapa al texto.
- Lighthouse (DevTools, móvil) sobre el hero: anota el LCP y compáralo con el del sitio publicado actual. Expected: LCP igual o mejor; el texto del hero no espera a la escena.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
chore(seo): update meta and structured data for the new positioning

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```
