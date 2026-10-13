# Portafolio 3D: "Cómo construyo software" — Diseño

Fecha: 2026-10-12
Estado: aprobado por el autor, con la segunda ronda de cambios incorporada (sección 14). Validado en un prototipo desechable (sección 13).

## 1. Objetivo

Convertir el portafolio en una experiencia de scroll 3D que comunique **cómo construyo software**: diseño con patrones, arquitectura que escala, desarrollo con IA, automatización, pruebas y despliegue. El impacto visual es el medio, no el fin. Un visitante debe salir entendiendo el proceso, no recordando una lista de tecnologías.

Éxito significa:

- Un visitante puede nombrar las 6 fases del proceso después de recorrer la página.
- El cohete vuela durante **todo** el scroll, pasa cerca de dos planetas grandes y nunca queda tapado por el texto.
- La página sigue funcionando sin WebGL, con `prefers-reduced-motion` y en móvil.
- Experiencia, proyectos, contacto e i18n (es/en) siguen disponibles y rastreables por buscadores.
- Carga inicial no empeora: el texto del hero aparece antes de que cargue la escena 3D.

## 2. Decisiones ya tomadas

| Tema | Decisión |
|---|---|
| Metáfora | Un cohete de partículas vuela de forma continua por el universo (scroll = cámara) y pasa cerca de **dos planetas grandes**. Sin engranajes. |
| Estilo | **Partículas luminosas** ámbar y azul sobre fondo oscuro, como el cohete de la referencia. Nada de materiales realistas: ni cascos metálicos, ni sombreado PBR, ni asteroides. |
| Proceso | Sección compacta de 6 fases (Descubrir, Diseñar, Construir con IA, Automatizar, Verificar, Escalar y entregar). Sin sticky ni scroll extra. |
| Identidad | Solo tema oscuro. Acento ámbar + azul eléctrico. Se elimina el toggle de tema y el modo claro. |
| Enfoque técnico | Un `<Canvas>` fijo (React Three Fiber) detrás de secciones DOM. Scroll con Lenis + GSAP ScrollTrigger. |

## 3. Alcance

**Dentro:** rediseño completo de layout, color y movimiento; escena 3D; secciones nuevas (Proceso, IA + automatización, Stack); reestilo de Experiencia y Proyectos; textos nuevos es/en; fallbacks; SEO.

**Fuera (YAGNI):** modelos `.glb`, materiales PBR y luces, engranajes, asteroides, anillos de estaciones, audio, cursor 3D, CMS, blog, modo claro, físicas, `@react-three/drei`.

## 4. Arquitectura

### 4.1 Dependencias

- Añadir: `@react-three/fiber` 9.8.1 (requerido por React 19), `@react-three/postprocessing` 3.2.0 y su par `postprocessing` 6.x (Bloom, Vignette, ChromaticAberration).
- Dev: `@eslint/js` y `globals`. El lint actual está roto (ESLint 9 sin flat config); se migra a `eslint.config.js`.
- Ya existen y se reutilizan: `three` 0.184, `gsap` (+ ScrollTrigger), `lenis`, `react-i18next`.
- Se instala la skill `react-three-fiber` de `vercel-labs/json-render` para guiar la implementación.

### 4.2 Capas

```
index.html
└─ App
   ├─ <Scene/>  (lazy, position: fixed, z-0, aria-hidden, pointer-events: none)
   │   ├─ CameraRig    vuela por la ruta, mira de reojo a los planetas, lente según velocidad
   │   ├─ Stars        6 000 estrellas que titilan
   │   ├─ Nebula       tres nubes de polvo muy tenues
   │   ├─ Streaks      líneas de velocidad, solo al hacer scroll rápido
   │   ├─ Planets      dos planetas grandes hechos de partículas
   │   ├─ Ship         el cohete de partículas; en Contacto se convierte en el retrato
   │   ├─ StackField   constelaciones del stack (solo en la sección Stack)
   │   └─ Post         Bloom + Vignette + un toque de aberración cromática
   ├─ scene-scrim (degradado que oscurece el lado del texto)
   └─ <main/> secciones DOM (z-10): Hero, Process, Automation, Stack, Work, Contact
```

Regla: **todo el texto es DOM**. El canvas es decorativo (`aria-hidden`). Así i18n, SEO, lectores de pantalla y selección de texto siguen funcionando.

### 4.3 Estructura de archivos

```
scripts/check-scene.mjs     tests de la lógica pura (node:test)
src/
  scene/
    math.js            lógica pura sin three.js: ruta, tiers, PRNG, muestreo del retrato, esfera de Fibonacci, constelaciones
    flight.js          director de vuelo, puro: inclinación, desvío y mirada ante planetas; FOV, estelas y cola según velocidad
    planetData.js      los dos planetas (datos)
    route.js           curva CatmullRom por estaciones, offsets de escenario y de crucero (three.js)
    journey.js         estado mutable compartido DOM → escena
    quality.js         tiers high / low / off (+ override ?tier= para QA)
    Scene.jsx  SceneBoundary.jsx  CameraRig.jsx  Stars.jsx  Nebula.jsx  Streaks.jsx  StackField.jsx
    Planets.jsx  Ship.jsx  shipGeometry.js  shaders.js  textures.js
  sections/
    Hero.jsx  Process.jsx  Automation.jsx  Stack.jsx  Work.jsx  Contact.jsx  SectionHeading.jsx
  hooks/useJourneySection.js
  data/content.js      estructura de contenido (ids, herramientas); el texto vive en lang.json
  (se mantienen y se reestilan)
    components/Experiences.jsx, Projects.jsx, ProjectIndex.jsx, BrandsCarousel.jsx
    layout/Header.jsx, Footer.jsx, StatusBar.jsx, ScrollRail.jsx, SetLang.jsx, SidebarLang.jsx
    hooks/useLenis.js, useLanguage.js
  (se eliminan)
    components/HeroBackground.jsx, Presentation.jsx, About.jsx, Curtain.jsx
    hooks/useTheme.js, layout/ToggleTheme.jsx, assets/andresmarquez.jpg
```

Los nombres de archivo no pueden diferir solo en mayúsculas (`Planets.jsx` vs `planets.js`): en Windows y macOS chocan. Por eso los datos son `planetData.js`.

`Curtain` se elimina: bloqueaba la animación del hero ~2,5 s y retrasaba el LCP.

### 4.4 Del scroll a la escena

- `journey.js` exporta un objeto mutable: `journey.section[id]` (0..1 por sección) y `journey.speed` (0..1, velocidad de la cámara).
- Cada sección DOM llama a `useJourneySection(id)`. Un ScrollTrigger mide cuánto ha cruzado la **línea central** del viewport esa sección. Las ventanas son contiguas; el hero usa `start: "top top"` porque su inicio ya queda por encima de la línea central en scroll 0.
- `routePosition()` suma esos progresos: el vuelo es **continuo**, sin pausas por sección. La distancia entre estaciones sigue la altura típica de cada sección (12, 29, 66, 32 y 94 unidades), así la cámara cubre la misma distancia por píxel en todas partes.
- Los componentes 3D leen `journey` en `useFrame`. **No hay `setState` por frame**; React no re-renderiza durante el scroll.
- R3F copia el prop `uniforms` al material: los uniforms se escriben vía `ref.current.material.uniforms`, o se usa una instancia real de `ShaderMaterial`.

### 4.5 Director de vuelo (`flight.js` + `CameraRig` + `Ship`)

El vuelo es una pequeña coreografía, toda en funciones puras con tests:

- **Pasadas junto a planetas.** Cerca de un planeta el cohete se desvía hacia el lado opuesto, se inclina (alabeo) hacia el giro y la cámara mira de reojo al planeta y rota un poco. Todo se mide en unidades de mundo (`z`) y vuelve a cero lejos del planeta.
- **Velocidad.** `journey.speed` sale de la distancia que recorre la cámara por segundo. Con ella crecen, sutilmente: el FOV (45° → 52°), la cola de la tobera, las líneas de velocidad (alfa máx. 0,3) y la aberración cromática (cero en reposo, para que las estrellas de 1 px no se vuelvan confeti rojo/azul).
- **Cámara.** Suavizado exponencial independiente del frame rate, paralaje del puntero, retroceso leve al ir rápido, y un tope al `delta` para que una pestaña oculta no teletransporte la cámara.
- **Cohete.** Vuela ~10 unidades por delante de la cámara y a la derecha de la columna de texto (arriba del texto en pantallas estrechas), para que los paneles nunca lo tapen.

### 4.6 Componentes de la escena

**Ship.** 28 000 partículas (high) / 10 000 (low) repartidas por la superficie de un lanzador (cono Von Kármán, cuerpo, tres bandas, dos propulsores laterales con su cono, cuatro aletas y tres toberas; ~8,5 unidades). Color por pieza: el cuerpo pasa de crema cálido en la nariz a azul en los motores, las bandas y conos son ámbar, las aletas azules. Un sombreado fijo da volumen. Un 8 % de las partículas flota como polvo. La cola de escape es suave y corta. Sin casco sólido ni luces: el aspecto es el de partículas brillantes con Bloom.

**Retrato.** En Contacto las mismas partículas se reordenan y forman el retrato de Andrés (atributo `aPortrait` + `mix` escalonado en el shader), con la foto `public/images/andres.jpg` (recorte de cabeza y hombros, umbral de luminancia 0,3). El retrato real aparece también como `<img>` en el DOM.

**Planets.** Dos planetas grandes de partículas, del mismo estilo que el cohete: una esfera de Fibonacci con bandas de latitud y manchas de nube, un halo y, el primero, un anillo de partículas.

| Planeta | `z` | Radio | Aspecto |
|---|---|---|---|
| Solis | −62 (sección IA) | 6,5 | gigante gaseoso ámbar con anillo |
| Cobalt | −182 (sección Trabajo) | 7,5 | gigante azul con bandas |

Aparecen al empezar el viaje (revelado entre r = 0,1 y 0,6), así el hero queda limpio. El tamaño de cada punto se calcula con cuántos puntos cubren el hemisferio visible, para que el globo se vea sólido a cualquier distancia o resolución. Los puntos de la cara oculta se atenúan.

**Stars / Nebula / Streaks.** Estrellas con parpadeo propio, casi todas blancas; tres nubes de polvo casi invisibles (opacidad 0,03) a la derecha y al fondo; líneas de velocidad que solo existen con scroll rápido.

**StackField.** Una constelación pequeña por grupo del stack, visible solo en esa sección.

**Post.** Bloom (umbral 0,7), Vignette y aberración cromática proporcional a la velocidad. Solo en tier `high`.

### 4.7 Secciones DOM

El texto vive en una columna a la izquierda (58 % del ancho en escritorio); la derecha queda libre para el cohete y los planetas. Un degradado fijo (`scene-scrim`) oscurece ese lado.

1. **Hero.** "Diseño. Desarrollo. Automatizo." / "I design. I develop. I automate." La frase explica el proceso (patrones de diseño, arquitectura que escala, desarrollo con IA, pruebas y despliegue), cinco etiquetas, CTA de WhatsApp y enlace a Proceso.
2. **Proceso.** Cuadrícula compacta de 6 tarjetas (fase, frase y prueba real). Una pantalla, sin sticky.
3. **IA + automatización.** "Mi taller con IA": cuatro tarjetas con icono (spec, contexto, herramientas, guardarraíles), legibles de un vistazo. "Automatizaciones reales": cinco casos con filas Problema / Solución / Resultado y etiquetas de herramientas **pequeñas**.
4. **Stack.** Agrupado por uso real, etiquetas pequeñas, sin barras de porcentaje.
5. **Trabajo.** `BrandsCarousel`, `Experiences` (6 entradas) y `Projects` en un panel casi opaco (`bg-bg/95`) para que nada se mezcle con el texto.
6. **Contacto.** Sección de 160vh con panel sticky mientras se forma el retrato; contactos y foto.

En tier `off`, Contacto es una sección normal y no hay canvas.

## 5. Sistema visual

- Fondo `#07070a`. Superficies `#0e0e12` / `#16161a`. Texto `#f5f5f7`, secundario al 60–75 % de opacidad.
- Acento ámbar `#FCD34D` (brillo `#F59E0B`). Acento azul eléctrico `#4F8CFF` (token `signal`).
- Tipografía actual: Space Grotesk (display), Geist (cuerpo), Geist Mono (etiquetas/datos).
- Se eliminan el modo claro, `darkMode: "class"`, los colores `flag` y los estilos del toggle.
- El selector de idioma tiene el mismo tamaño y aspecto que las demás pestañas del menú.

## 6. Contenido (i18n)

Todo el contenido sale de trabajo real encontrado en el equipo del autor. Regla: no se publica nada que no sea verificable.

### 6.1 Las 6 fases

1. **Descubrir** — Hablo con el negocio, encuentro el dolor real y decido qué se construye y qué se automatiza. *Prueba:* requisitos del ERP de Distribuciones Marver y de Monchis Mercado definidos con el cliente.
2. **Diseñar** — Arquitectura, modelo de datos y patrones de diseño: controladores delgados, capa de servicios y adaptadores para integraciones; todo en una spec antes del código. *Prueba:* ERP V‑Pro 360 con patrón Service, adaptadores de integraciones y migración Strangler Fig.
3. **Construir con IA** — Desarrollo con agentes y skills; yo fijo el estándar, dirijo y reviso cada cambio. *Prueba:* skill de arquitectura propia del ERP como estándar, con comandos `/audit`, `/verify` y `/migrate-module`.
4. **Automatizar** — n8n, Zapier, GoHighLevel y Python conectan sistemas y eliminan trabajo manual. *Prueba:* flujos en producción para QSM, MContigo y Distribuciones Marver.
5. **Verificar** — Tests, revisión de código y medición de rendimiento antes de entregar. *Prueba:* suite Playwright para sitios Leadbox; Pest y PHPStan nivel 8 en el ERP.
6. **Escalar y entregar** — Despliegue, colas y tareas programadas, transacciones seguras, monitoreo e iteración; pensado para crecer sin reescribir. *Prueba:* scheduler y colas en producción en el ERP; Vulister +80 % de rendimiento frontend; Leadbox −40 % de tiempo de carga.

### 6.2 Mi taller con IA (cuatro pilares)

1. **Spec antes que código.** Brainstorming, spec escrita, plan y luego implementación.
2. **Contexto persistente.** Skills por proyecto y una memoria en Obsidian con la arquitectura documentada.
3. **Herramientas conectadas.** Servidores MCP para n8n, Playwright, el editor real de WordPress y HubSpot en solo lectura.
4. **Guardarraíles.** Ningún secreto dentro de un workflow. Solo lectura por defecto en sistemas de terceros. Despliegue solo a petición.

IA dentro del producto: agentes con Gemini (nodos LangChain de n8n) que localizan dónde estampar firma y fechas en PDFs, con salida estructurada (QSM). MEDCARDS.AI no es del autor: pertenece a un corpus público descargado.

### 6.3 Automatizaciones reales (casos)

Los sistemas privados se muestran en texto, **nunca con capturas**. Nombres autorizados: Triple‑S pertenece a **QSM**; el e‑commerce de Amazon UE pertenece a **MContigo**. MContigo aparece en casos y proyectos, **nunca** en Experiencia.

| Caso | Solución | Herramientas |
|---|---|---|
| QSM — referidos médicos Triple‑S | Flujos n8n que procesan casos, envían correos, registran notas y estampan firma y fechas en el PDF; panel Next.js + Supabase en tiempo real con corrección de casos y auditoría | n8n, Gemini, Next.js, Supabase |
| MContigo — calidad de datos Amazon ES/IT | Pipeline diario que detecta productos sin UID o Child ASIN válido, valida con reglas confirmadas contra los datos y publica un historial en Google Sheets | Python, pandas, Deepnote, Google Sheets API |
| Leadbox — inventario de concesionarios | GraphQL público consultado directamente en lugar de scrapear HTML: 477 vehículos en 4 peticiones | Python, GraphQL |
| Distribuciones Marver — ERP + CRM | Sincronización OAuth de clientes, vacaciones y ausencias con GoHighLevel; notificaciones después del commit | Laravel, GoHighLevel, OAuth 2.0, Twilio |
| Leadbox — QA de sitios | Responsive, formularios, cabeceras de seguridad y mapas desde fuera, con reporte | Playwright, OWASP ZAP, TypeScript |

En MContigo el trabajo del autor es el detector de calidad de datos; el motor de pedidos por contenedor solo lo documentó.

### 6.4 Stack (agrupado por uso real)

- **En producción:** Laravel, Vue, React, Next.js, Angular, WordPress, Tailwind CSS, MySQL, PostgreSQL, Supabase.
- **Automatización y datos:** n8n, Zapier, GoHighLevel, Python, pandas, Playwright.
- **IA:** Claude Code, MCP, OpenSpec, Gemini.
- **3D:** Three.js, React Three Fiber.
- **Formándome ahora:** NestJS, Node.js.

### 6.5 Proyectos

Se quitan **Expresso** y **Drive IAG** de la lista. Quedan: Kenk Napp Ford, QSM · Triple‑S y MContigo (privados, enlazan a su caso en la misma página), IAG Group, Go North Surrey GM, Leadbox, Dropanas, Vulister y Multiparadise.

### 6.6 Claves de traducción

Se añaden las claves de hero, proceso, IA, casos, stack, trabajo y contacto. Se eliminan las que solo usaban los componentes borrados. Se corrigen dos erratas: "Distribuiciones" → "Distribuciones" y "Automatizé" → "Automaticé".

### 6.7 Imágenes

- Retrato: `C:\Users\pc\Downloads\andres.jpeg` → `public/images/andres.jpg` (165 KB). También es la imagen de Open Graph.
- Sistemas privados: sin capturas.

## 7. Calidad, rendimiento y accesibilidad

**Tiers (`quality.js`):** `high` (desktop), `low` (puntero táctil, `hardwareConcurrency ≤ 4` o ancho < 768), `off` (sin WebGL2 o `prefers-reduced-motion`). `?tier=high|low|off` fuerza un tier para QA.

| Aspecto | high | low | off |
|---|---|---|---|
| Estrellas | 6 000 | 2 500 | — |
| Partículas del cohete | 28 000 | 10 000 | — |
| Puntos por planeta / anillo | 26 000 / 9 000 | 10 000 / 3 500 | — |
| Nebulosa / cola | 350 / 900 | 180 / 350 | — |
| Líneas de velocidad | 260 | no | — |
| Post (Bloom, Vignette, aberración) | sí | no | — |
| DPR máximo | 1.75 | 1.25 | — |
| Render | continuo | continuo | sin canvas; fondo CSS estático |

- La escena es un chunk lazy (`React.lazy`); three.js no entra en el bundle principal (+3 KB gzip; chunk 3D ~280 KB gzip).
- `frameloop="never"` con la pestaña oculta.
- Canvas `aria-hidden`, `pointer-events: none`. Foco y orden de lectura siguen el DOM. `<html lang>` sigue al idioma elegido.
- Contraste: columna de texto a la izquierda con `scene-scrim`, paneles `bg-bg/80–95` con desenfoque, y panel casi opaco en Trabajo.
- `StatusBar` detecta la sección con una banda a media pantalla.

## 8. Manejo de errores

- Sin WebGL2, pérdida de contexto, fallo del chunk o del shader: `SceneBoundary` y `webglcontextlost` degradan a tier `off` sin dejar la pantalla en blanco.
- Foto ausente o bloqueada: el cohete sigue siendo cohete; sin error.

## 9. Verificación

- `npm run lint` (flat config) sin problemas y `npm run build` correcto.
- `npm run check`: 14 tests `node:test` sobre la lógica pura (ruta continua, tiers, PRNG, muestreo del retrato, constelaciones, esfera de Fibonacci, planetas grandes y fuera del camino del cohete, `uAtZ`, pasadas junto a planetas, efectos de velocidad acotados).
- Comprobación manual en navegador por tarea: scroll adelante y atrás, idioma, móvil, `?tier=off`, consola sin errores.
- Medición final: Lighthouse del hero.

## 10. Fases de implementación

Ver el plan: `docs/superpowers/plans/2026-10-12-3d-process-portfolio.md`.

## 11. Preguntas resueltas

1. "iLevel" = **GoHighLevel** (integración OAuth en producción en el ERP de Marver).
2. Herramientas de IA: las de 6.2, presentes en el equipo del autor.
3. Angular: producción (ERP V‑Pro 360). NestJS y Node.js: formación.
4. `Curtain`: eliminada (retrasaba el LCP).

## 12. Notas del autor

- Clientes: QSM (Triple‑S) y MContigo se nombran en los casos. MContigo no entra en Experiencia.
- Zapier: sin proyectos en el equipo; se mantiene en el stack porque el autor lo usa, sin caso inventado.

## 13. Lecciones del prototipo

- `active` es palabra reservada en GLSL: un shader no compilaba.
- R3F 9 copia el objeto `uniforms` al material: se escriben vía la ref del material o con una instancia real de `ShaderMaterial`.
- El umbral genérico de luminancia (0,18) metía la pared en el retrato; se calibró a 0,3 con el histograma de la foto.
- ScrollTrigger no recorta un `start` negativo: el hero empezaba en 0,5. Por eso usa `start: "top top"`.
- Un planeta que se desvanece por color queda como disco negro opaco sobre las estrellas; se desvanece por alfa.
- La aberración cromática en reposo convierte las estrellas de 1 px en confeti rojo y azul; solo actúa con velocidad.
- `Planets.jsx` y `planets.js` chocan en sistemas sin distinción de mayúsculas.
- Un panel de ancho completo tapa al cohete justo en las secciones largas: el texto va en una columna y el cohete vuela por la derecha.

## 14. Segunda ronda de cambios del autor (2026-10-12)

Pedidos y cómo quedaron:

| Pedido | Resultado |
|---|---|
| Quitar Expresso y Drive IAG | Fuera de `Projects.jsx` |
| Selector de idioma del mismo tamaño que las demás pestañas | `SetLang`: `px-3 py-2 text-sm`, mismos colores y hover |
| Cohete más realista (parecía de niño) | Forma de lanzador real (ogiva Von Kármán, propulsores, aletas, toberas) **en estilo de partículas**. Un primer intento con casco metálico se descartó: el autor quiere el estilo original |
| Hero "Diseño. Desarrollo. Automatizo." con patrones de diseño, escalabilidad y toda la fase de desarrollo | Titular, frase y cinco etiquetas |
| Sin engranajes; sección más corta y optimizada, manteniendo el cohete | Proceso compacto de 6 tarjetas, sin sticky |
| "Mi taller con IA" no se entendía; herramientas más pequeñas | Cuatro tarjetas con icono; casos en filas; etiquetas de 9 px |
| El cohete solo se movía al llegar a QA | Vuelo continuo durante todo el scroll |
| Añadir Node.js a "Formándome ahora" | Hecho |
| Experiencia y proyectos sin choque con las letras | Panel casi opaco y columna de texto aparte |
| Turbo menos fuerte | Cola corta, 900 partículas, alfa 0,5 |
| Planetas y estrellas, mismo estilo, más elementos | **Dos** planetas grandes de partículas (pedido posterior: la escena estaba cargada), 6 000 estrellas, tres nubes tenues |
| Viaje con animaciones de Three.js de primer nivel | Director de vuelo (sección 4.5): pasadas junto a planetas, alabeo, mirada de reojo, FOV, líneas de velocidad, Bloom y Vignette |
| Quitar planetas: dos, grandes | Dos planetas de radio 6,5 y 7,5; sin asteroides ni anillos de estaciones |
