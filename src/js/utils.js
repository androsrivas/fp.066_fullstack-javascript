// js/utils.js
// Funciones pequeñas que usan varias páginas.
/*
  PROMPTS DE IA USADOS EN ESTE ARCHIVO
  1) IA: Claude | Prompt: "Hazme una función que convierta un texto en texto seguro para evitar que se ejecute un script (XSS)."
  2) IA: Claude | Prompt: "Función que muestre un aviso de Bootstrap (alert) con botón de cerrar dentro de un contenedor."
  3) IA: Claude | Prompt: "Función que calcule el siguiente id de una lista como el máximo más uno."
  4) IA: Claude | Prompt: "Explícame las plantillas de texto con comillas invertidas y ${}."
*/
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
