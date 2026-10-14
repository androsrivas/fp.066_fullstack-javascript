// js/utils.js
// Funciones pequeñas que usan varias páginas.
// Convierte un texto en "texto seguro": si alguien escribe <b> o <script>,
// se verá como letras normales y no se ejecutará como código.
export function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// Muestra un mensaje de color (verde, rojo...) dentro de un contenedor.
export function mostrarAviso(contenedor, texto, tipo = "success") {
  contenedor.innerHTML =
    `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">` +
    `${escaparHtml(texto)}` +
    `<button type="button" class="btn-close" data-bs-dismiss="alert"` +
    ` aria-label="Cerrar"></button></div>`;
}

// Calcula el "id" que debe tener un elemento nuevo de una lista.
// Usa el id más alto que exista + 1. Si la lista está vacía, devuelve 1.
export function siguienteId(lista) {
  return lista.length ? Math.max(...lista.map((elemento) => elemento.id)) + 1 : 1;
}
