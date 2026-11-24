# Pairtial Style Brand

**v0.1.0** — catálogo interactivo de la identidad visual Pairtial. React + TypeScript + Vite; servidor HTTP de Node.js sin dependencias externas. La librería de estilos es CSS independiente de React.

## Arranque (Windows, Linux o macOS)

Requiere Node.js 20.19+ (recomendado Node 22.12+) y npm.

```sh
npm install
npm run dev
```

Abre http://localhost:5173. La API queda en http://localhost:3001. Para producción:

```sh
npm run build
npm start
```

Abre http://localhost:3001. El puerto de producción se puede configurar con `PORT`.

## Estructura

```text
pairtial-style-brand/
├── packages/brand/          # Workspace @pairtial/style-brand
│   ├── tokens.css          # Variables de diseño
│   ├── tokens.json         # Mismos valores en JSON plano
│   ├── themes.css          # Adaptación oscura opt-in
│   ├── components.css      # Clases reutilizables pt-*
│   ├── index.css           # Punto de entrada
│   └── package.json
├── src/
│   ├── catalog.json        # Registro declarativo de los ejemplos
│   ├── App.tsx             # Catálogo, filtros e inspector
│   ├── main.tsx
│   └── studio.css          # CSS exclusivo del catálogo
├── server/                 # HTTP, API, pruebas
├── scripts/dev.mjs         # Arranca Vite y Node conjuntamente
└── vite.config.ts
```

## Catálogo

43 muestras en superficies, botones, controles, tiles, nodos, tipografía, movimiento y estados. 131 tokens. Búsqueda por nombre, clase y descripción; favoritos persistentes en localStorage; fondos claro, oscuro o color; modo compacto; inspector HTML/JSX/CSS; tema claro/oscuro. Los controles de demostración usan HTML nativo; no son implementaciones de lógica de negocio ni de un editor de nodos.

`catalog.json` es la fuente del catálogo, incluyendo HTML estático de confianza escrito en el repositorio. No cargar HTML externo sin sanitizarlo. Para agregar un estilo, define su clase en `components.css`, usa tokens cuando sea posible y registra un ejemplo con un ID único, categoría, descripción, clases, HTML y fondo. El inspector presenta las reglas CSS relacionadas como referencia; el import completo incluye sus dependencias y animaciones.

## Usar el branding en otra app

El workspace local se llama `@pairtial/style-brand`. Todavía no se publica en npm. Para probar en otro proyecto, desde este repo crea un paquete tarball local:

```sh
npm pack --workspace @pairtial/style-brand
```

En el proyecto consumidor instala el archivo generado con su ruta real:

```sh
npm install ../pairtial-style-brand/pairtial-style-brand-0.1.0.tgz
```

En React/Vite:

```tsx
import '@pairtial/style-brand';

export function Example() {
  return <button className="pt-btn pt-btn--black">Continue</button>;
}
```

También puedes copiar `packages/brand/` a una web HTML y enlazar su `index.css`, o servir los estilos con Node (`/styles/index.css`). Para el tema oscuro, coloca `data-pt-theme="dark"` en un elemento padre. No se modifica globalmente el layout de las aplicaciones consumidoras; `.pt-shell` es opt-in.

## API

| GET | Respuesta |
|---|---|
| `/api/health` | Estado y versión |
| `/api/catalog` | Registro de ejemplos |
| `/api/tokens` | Variables de diseño JSON |
| `/styles/index.css` | Entrada CSS |
| `/styles/tokens.css` | Tokens |
| `/styles/components.css` | Componentes |
| `/styles/themes.css` | Temas |

El cliente importa los JSON estáticos directamente para que el catálogo no dependa de peticiones HTTP. La API permite que otros proyectos consuman los mismos datos.

## Criterios visuales y cambios

- Neutros plata/blanco, negro para contraste, azul para selección, naranja para identidad y ejecución.
- Borde por capas de 1 px conservado con padding y contenido en flujo normal (en lugar de depender de posición absoluta).
- Sombras dobles, haloes, texto degradado y nodos tipados preservados. Escala de hover opt-in en tarjetas estáticas.
- Inputs con altura intrínseca y sliders/checkboxes nativos funcionales; puertos con tamaño fijo configurable.
- Tema oscuro, toggle, mejoras de foco y reducción de movimiento añadidos como extensiones de esta versión.
- No se incluyen fuentes SF Pro ni otros archivos de fuente; se usan fallbacks del sistema. Añadir la fuente propia solo tras confirmar derechos.
- Antes de publicar: decidir licencia, verificar disponibilidad del nombre npm, revisar contraste y compatibilidad visual, ejecutar build y pruebas, retirar `private` del paquete CSS. No se concede una licencia pública por defecto.

## Comprobaciones

```sh
npm test
npm run typecheck
npm run build
```

Las pruebas nativas verifican IDs y clases del catálogo, consistencia de tokens y endpoints HTTP. No sustituyen pruebas visuales en navegador.
"# pairtial-style-brand" 
