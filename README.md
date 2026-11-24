# Pairtial Style Brand — 0.4.2

Catálogo unificado de 91 estilos: los 49 originales y 42 incorporados del archivo visual. React + TypeScript + Vite y servidor Node. Un solo catálogo; cada tarjeta conserva la versión de origen. Colores, gradientes y tokens son referencias independientes de los 91 ejemplos.

## Ejecutar

```cmd
npm install --include=dev
npm run dev
```

Frontend: http://localhost:5173. API: http://localhost:3001.

```cmd
npm test
npm run build
npm start
```

## Fuentes locales

Conserva `public/fonts/` de tu instalación anterior o ejecuta `npm run fonts -- "C:\ruta\a\tus\fuentes"`. Las fuentes OTF no se distribuyen en este repositorio. Pair Regular (`pair.otf`) se usa exclusivamente en los glifos de identidad. Las fuentes tipográficas tienen familias independientes. Comprueba sus licencias antes de publicar.

## Consumir los estilos

El paquete CSS local `packages/brand` no depende de React. Importa `@pairtial/style-brand` desde el workspace. El catálogo permite copiar HTML, JSX y CSS. El paquete todavía no está publicado en npm.

Las clases `.pt-layer` y `.pt-btn` preservan la geometría v1. Las variantes v2 usan `.pt-layer-ring` y `.pt-ring-btn`, con `.pt-ring__inner` y `.pt-ring__face` para sus capas. No se mezclan las geometrías incompatibles. Los materiales v1 seleccionados conservan sus sombras internas originales; la luz exterior azul solo se activa dentro de un ancestro `data-pt-surface="dark"`.

```html
<button class="pt-btn pt-btn--black">Continue</button>
<button class="pt-ring-btn pt-btn--orange">
  <span class="pt-ring__inner"><span class="pt-ring__face">Continue</span></span>
</button>
<div data-pt-surface="dark">
  <button class="pt-btn pt-btn--select">Continue</button>
</div>
```

La selección alternativa usa `.pt-is-selected-alternative`. Brand spectrum usa `.pt-bg-brand` (2px de altura; ancho ajustable).

## Estructura

- `packages/brand/`: CSS, tokens JSON, temas.
- `src/catalog.json`: lista unificada de estilos con origen.
- `src/App.tsx`: catálogo, filtros, favoritos, inspector y vistas previas.
- `server/`: API y pruebas de regresión de la selección.
- `scripts/`: arranque e instalación de fuentes locales.

## v0.3.4 — Catálogo unificado

Se retira el laboratorio y se incorporan los 42 estudios restantes al catálogo principal por categoría. Se descartan Product presentation panel, Glass device icon y Violet split selection; Steel blue se integra como variante de Violet service card. Los nombres CSS históricos `pt-exp-*` se conservan por compatibilidad; ya forman parte de `components.css` y del import principal. El antiguo subpath CSS `experimental.css` es un alias compatible, no una colección separada. `/api/catalog` contiene los 91 estilos.

- Active pipeline: borde gris giratorio, sin pulsación. Pipeline pulse conserva el borde azul-cian y halos sólidos.
- Violet service card: cambia `data-variant="violet"` a `data-variant="steel"` en el contenedor para cambiar el material.
- Split settings popover: independiente de la selección violeta eliminada.
- Smart Colors: título con Pair Pro Display Medium.
- Silvana start button: anillo degradado giratorio sin rotar el contenido.
- Las rotaciones respetan `prefers-reduced-motion`.

Las File Cards mantienen su selector cromático y `data-format`. Los favoritos de Steel blue migran a Violet service card. No se redistribuyen fuentes OTF.

## v0.4.0 — Compositions

La sección Implementaciones → Ejemplos contiene siete composiciones React interactivas. Cada una ofrece filtros por ámbito, búsqueda, ampliación, restablecimiento y enlaces al inspector de los materiales del catálogo. Las demostraciones no envían datos ni ejecutan IA real.

- Agent workspace: selección de agente, parámetros, prompt y ejecución simulada (puedes completar o detener la simulación).
- Visual node editor: selección, renombrado, adición de nodos y disposición horizontal/vertical/cuadrícula/compacta; fondo claro o carbón.
- Document library: búsqueda, selección, favoritos y dock.
- Services gallery: filtros, búsqueda y selección de servicios para comparación.
- Silvana assistant: selección de icono, creación y selección de conversaciones locales.
- Material & color inspector: matiz, saturación, radio, intensidad, acento y modo oscuro.
- Product access: navegación, selección de producto y acciones de acceso ficticias.

`src/Examples.tsx` contiene los componentes y su comportamiento local, `src/examples.css` contiene únicamente el layout y ajustes de escala/contexto de las composiciones, `src/examples.json` contiene sus metadatos y referencias al catálogo. `GET /api/examples` devuelve estos metadatos. Los 91 estilos y los archivos CSS de la librería permanecen idénticos a v0.3.4. No se incluyen fuentes OTF.

## v0.4.1 — Compositions expanded

13 demos locales: siete ejemplos existentes con datos generales y seis nuevas composiciones (tienda, presupuesto, casa inteligente, tareas, agenda y mezclador visual). Los datos son ficticios y no se conectan a servicios, dispositivos ni reproducción de audio. `src/NewExamples.tsx` y `src/new-examples.css` contienen las nuevas composiciones. Los 91 estilos CSS y el catálogo se conservan sin cambios.

## v0.4.2 — Creative compositions

28 demostraciones (13 anteriores + 15 nuevas), 91 estilos aprobados sin cambios. Las nuevas interfaces están implementadas en `src/CreativeExamples.tsx` y su layout en `src/creative-examples.css`. Todas operan localmente, con datos ficticios e ilustraciones SVG originales; no requieren servicios ni realizan operaciones reales.

- **Laboratorio fotográfico**: Ajusta exposición, contraste, monocromo y guías de una ilustración de paisaje.
- **Estudio de arquitectura**: Explora un plano, selecciona habitaciones y modifica la escala y las cotas.
- **Viajes en tren**: Compara itinerarios ficticios, elige asiento y pasajeros, y calcula el precio de prueba.
- **Colección de arte**: Explora obras abstractas originales de demostración, consulta sus fichas y guarda favoritas.
- **Estación de café**: Configura dosis, agua y temperatura de una receta de café; consulta su proporción.
- **Instrumentos de conducción**: Explora un velocímetro simulado, modos de conducción y el control de luces.
- **Observatorio nocturno**: Selecciona cuerpos celestes ilustrativos, aumenta la vista y activa la retícula.
- **Composición editorial**: Edita un cartel tipográfico, alterna pesos, alineación y papel claro u oscuro.
- **Relojes internacionales**: Explora relojes analógicos y diferencias horarias con una referencia UTC simulada.
- **Invernadero inteligente**: Selecciona zonas de cultivo y ajusta humedad, iluminación y riego simulados.
- **Sala de cine**: Elige una función ficticia, selecciona asientos y consulta el importe total.
- **Centro de envíos**: Busca paquetes ficticios, inspecciona sus etapas de tránsito y cambia preferencias locales.
- **Secuenciador rítmico**: Construye patrones de ocho pasos, silencia canales y ajusta el tempo visual. No reproduce audio.
- **Estancias boutique**: Compara habitaciones ilustradas, ajusta noches y huéspedes y calcula una estancia ficticia.
- **Preparación de impresión**: Ajusta formato, acabado, margen y copias de una prueba gráfica simulada.
