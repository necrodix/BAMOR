# Portal BAMOR

Estructura profesional y escalable para portal web.

## Estructura de carpetas

- `index.html`: estructura principal del portal.
- `css/style.css`: estilos globales optimizados con variables CSS y componentes reutilizables.
- `scripts/main.js`: renderizado dinámico del contenido.
- `config/portal.config.js`: fuente de verdad del contenido del sitio.
- `images/`: logo, fondo hero y recursos visuales de servicios.

## Cómo escalar el portal

1. Edita `config/portal.config.js` para cambiar texto, teléfono, servicios, FAQ y enlaces sociales.
2. Agrega nuevas imágenes en `images/` y actualiza la ruta en la configuración.
3. Para agregar secciones nuevas, crea el bloque en `index.html` y renderízalo desde `scripts/main.js`.

## Notas

- El sitio usa Bootstrap 5 y Bootstrap Icons por CDN.
- El contenido principal no está hardcodeado en HTML; se inyecta desde configuración.
