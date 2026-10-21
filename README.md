# Tándem – Producto 1 (FP066, equipo Node3)

Frontend de una plataforma de intercambio de idiomas: HTML5, CSS3, Bootstrap 5 y JavaScript (módulos ES).

## Cómo ejecutarlo
Los módulos ES **no funcionan abriendo el HTML con doble clic**; hace falta un servidor local:
- VS Code: extensión *Live Server* → clic derecho en `src/pages/index.html` → "Open with Live Server".
- O con Node: `npm start`.

## Usuarios de prueba
- laura@tandem.com / 1234
- john@tandem.com / abcd
- aya@tandem.com / 5678

## Estructura
- `src/pages/` páginas HTML · `src/css/` estilos · `src/js/` scripts (`datos.js` = datos comunes)

Los datos viven en arrays en memoria: no hay persistencia (se pierden al recargar).
