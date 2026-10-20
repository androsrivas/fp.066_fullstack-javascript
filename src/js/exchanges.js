// js/exchanges.js
// Pantalla de Intercambios: publicar, filtrar, buscar y borrar.
//
// PROMPTS DE IA USADOS EN ESTE ARCHIVO
// 1) IA: Claude | Prompt: "Escribe el JS de Intercambios: pintar tarjetas desde el array intercambios de datos.js y publicar uno nuevo con push."
// 2) IA: Claude | Prompt: "Haz un filtro por tipo, otro por idioma y un buscador de texto que se combinen entre sí con Array.filter."
// 3) IA: Claude | Prompt: "Rellena el desplegable de autores recorriendo el array usuarios y muestra el nombre de quien publica en cada tarjeta."
// 4) IA: Claude | Prompt: "Pide confirmación con un modal de Bootstrap antes de borrar con splice y avisa si no hay resultados."
import { usuarios, intercambios } from "./datos.js";
import { escaparHtml, mostrarAviso, siguienteId } from "./utils.js";

// 1. Localizamos los elementos de la página
const formulario = document.getElementById("form-intercambio");
const aviso = document.getElementById("aviso-intercambios");
const contenedor = document.getElementById("tarjetas");
const contador = document.getElementById("contador");
const sinResultados = document.getElementById("sin-resultados");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroIdioma = document.getElementById("filtro-idioma");
const buscador = document.getElementById("buscador");
const campoAutor = document.getElementById("autor");
const tituloBorrado = document.getElementById("titulo-borrado");
const botonBorrar = document.getElementById("confirmar-borrar");
// "bootstrap" viene del script bundle que carga la página antes que este módulo
const modalBorrar = new bootstrap.Modal(document.getElementById("modal-borrar"));

let idNuevo = null;      // id del intercambio recién publicado
let idPendiente = null;  // id del intercambio que se quiere borrar

// 2. Rellenamos el desplegable de autores con los usuarios de datos.js
campoAutor.innerHTML = '<option value="">Elige…</option>' +
  usuarios.map((u) => `<option value="${escaparHtml(u.email)}">${escaparHtml(u.nombre)}</option>`).join("");

// 3. Devuelve el nombre de quien publica a partir de su correo
function nombreDe(email) {
  const usuario = usuarios.find((u) => u.email === email);
  return usuario ? usuario.nombre : email;
}

// 4. Construye UNA tarjeta
function crearTarjeta(i) {
  const esOferta = i.tipo === "oferta";
  const columna = document.createElement("div");
  columna.className = "col-12 col-md-6 col-lg-4";
  columna.innerHTML = `
    <div class="card tarjeta-intercambio h-100 ${esOferta ? "" : "peticion"}">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <span class="badge ${esOferta ? "text-bg-success" : "text-bg-warning"}">${esOferta ? "Oferta" : "Petición"}</span>
          ${i.id === idNuevo ? '<span class="badge text-bg-primary">Nuevo</span>' : ""}
        </div>
        <h3 class="h6 card-title">${escaparHtml(i.titulo)}</h3>
        <p class="card-text small text-muted mb-1">
          ${escaparHtml(i.idioma)} · Nivel ${escaparHtml(i.nivel)} · ${escaparHtml(i.modalidad)}
        </p>
        <p class="card-text small">${escaparHtml(i.descripcion)}</p>
        <div class="mt-auto d-flex justify-content-between align-items-center">
          <span class="small text-muted">Por ${escaparHtml(nombreDe(i.autor))}</span>
          <button type="button" class="btn btn-sm btn-outline-danger" data-borrar="${i.id}">Borrar</button>
        </div>
      </div>
    </div>`;
  return columna;
}

// 5. Aplica los tres filtros a la vez y pinta el resultado
function pintar() {
  const tipo = filtroTipo.value;
  const idioma = filtroIdioma.value;
  const texto = buscador.value.trim().toLowerCase();
  const visibles = intercambios.filter((i) =>
    (tipo === "todos" || i.tipo === tipo) &&
    (idioma === "todos" || i.idioma === idioma) &&
    (texto === "" || (i.titulo + " " + i.descripcion).toLowerCase().includes(texto))
  );
  contenedor.innerHTML = "";
  visibles.forEach((i) => contenedor.appendChild(crearTarjeta(i)));
  contador.textContent = `Mostrando ${visibles.length} de ${intercambios.length} intercambios`;
  sinResultados.classList.toggle("d-none", visibles.length > 0);
}

// 6. Publicar: al enviar el formulario
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!formulario.checkValidity()) {
    formulario.classList.add("was-validated"); // activa los avisos rojos de Bootstrap
    return;
  }
  const nuevo = {
    id: siguienteId(intercambios),
    tipo: formulario.elements.tipo.value,
    idioma: formulario.elements.idioma.value,
    nivel: formulario.elements.nivel.value,
    modalidad: formulario.elements.modalidad.value,
    titulo: formulario.elements.titulo.value.trim(),
    descripcion: formulario.elements.descripcion.value.trim(),
    autor: formulario.elements.autor.value,
  };
  intercambios.push(nuevo);
  idNuevo = nuevo.id;
  // Quitamos los filtros para que se vea la tarjeta recién publicada
  filtroTipo.value = "todos";
  filtroIdioma.value = "todos";
  buscador.value = "";
  pintar();
  mostrarAviso(aviso, "Intercambio publicado correctamente.", "success");
  formulario.reset();
  formulario.classList.remove("was-validated");
});

// 7. Los filtros y el buscador repintan al momento
filtroTipo.addEventListener("change", pintar);
filtroIdioma.addEventListener("change", pintar);
buscador.addEventListener("input", pintar);

// 8. Borrar: un solo listener para todos los botones (delegación de eventos)
contenedor.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-borrar]");
  if (!boton) return;
  idPendiente = Number(boton.dataset.borrar);
  tituloBorrado.textContent = intercambios.find((i) => i.id === idPendiente).titulo;
  modalBorrar.show();
});

botonBorrar.addEventListener("click", () => {
  const posicion = intercambios.findIndex((i) => i.id === idPendiente);
  if (posicion !== -1) {
    intercambios.splice(posicion, 1);
    mostrarAviso(aviso, "Intercambio borrado.", "warning");
  }
  idPendiente = null;
  modalBorrar.hide();
  pintar();
});

// 9. La primera vez que se abre la página, pintamos todo
pintar();
