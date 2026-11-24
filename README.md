# Pairtial Style Brand — 0.3.4

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
