// js/dashboard.js
// Pinta una tarjeta por cada intercambio del archivo datos.js
/*
  PROMPTS DE IA USADOS EN ESTE ARCHIVO
  1) IA: Claude | Prompt: "Escribe el JS que recorra el array intercambios importado de datos.js y cree una tarjeta de Bootstrap por cada elemento con createElement."
  2) IA: Claude | Prompt: "¿Cómo corto una descripción larga a 80 caracteres y añado puntos suspensivos?"
  3) IA: Claude | Prompt: "Haz que el filtro de tipo repinte las tarjetas con Array.filter cuando cambie el desplegable."
  4) IA: Claude | Prompt: "¿Por qué debo usar escaparHtml antes de meter texto en innerHTML?"
*/
import { intercambios } from "./datos.js";
import { escaparHtml } from "./utils.js";
import "./nav.js"; // muestra el correo de la persona logueada en la barra
// 1. Localizamos en la página los elementos con los que vamos a trabajar
const contenedor = document.getElementById("tarjetas");
const filtro = document.getElementById("filtro-tipo");
const contador = document.getElementById("contador");
// 2. Función que construye UNA tarjeta a partir de UN intercambio
function crearTarjeta(intercambio) {
  const esOferta = intercambio.tipo === "oferta";
  // Si la descripción es muy larga, la cortamos y añadimos "…"
  const d = intercambio.descripcion;
  const resumen = d.length > 80 ? d.slice(0, 80) + "…" : d;
  const columna = document.createElement("div");
  columna.className = "col-12 col-md-6 col-lg-4";
  columna.innerHTML = `
    <div class="card tarjeta-intercambio h-100 ${esOferta ? "" : "peticion"}">
      <div class="card-body">
        <span class="badge ${esOferta ? "bg-success" : "bg-warning text-dark"} mb-2">
          ${esOferta ? "Oferta" : "Petición"}
        </span>
        <h2 class="h6 card-title">${escaparHtml(intercambio.titulo)}</h2>
        <p class="card-text small text-muted">
          ${escaparHtml(intercambio.idioma)} ·
          Nivel ${escaparHtml(intercambio.nivel)} ·
          ${escaparHtml(intercambio.modalidad)}
        </p>
        <p class="card-text small">${escaparHtml(resumen)}</p>
      </div>
    </div>`;
  return columna;
}
// 3. Función que vacía el contenedor y vuelve a pintar las tarjetas
function pintarTarjetas() {
  const tipoElegido = filtro.value; // "todos", "oferta" o "peticion"
  contenedor.innerHTML = "";
  const visibles = intercambios.filter(
    (i) => tipoElegido === "todos" || i.tipo === tipoElegido
  );
  visibles.forEach((i) => contenedor.appendChild(crearTarjeta(i)));
  contador.textContent = `Mostrando ${visibles.length} de ${intercambios.length} intercambios`;
}
// 4. Cuando el usuario cambia el desplegable, volvemos a pintar
filtro.addEventListener("change", pintarTarjetas);
// 5. Y la primera vez que se abre la página, pintamos todo
pintarTarjetas();