// js/users.js
// Pantalla de Usuarios: alta con validación, lista y baja con confirmación.
//
// PROMPTS DE IA USADOS EN ESTE ARCHIVO
// 1) IA: Claude | Prompt: "Escribe el JS de la pantalla de Usuarios: pintar una tabla desde el array usuarios de datos.js y dar de alta usuarios nuevos con push."
// 2) IA: Claude | Prompt: "Valida el formulario con checkValidity y con setCustomValidity para el correo repetido y para que el idioma nativo y el que aprende sean distintos."
// 3) IA: Claude | Prompt: "Explícame cómo abrir un modal de Bootstrap desde JavaScript y borrar con splice el usuario elegido al confirmar."
// 4) IA: Claude | Prompt: "Usa escaparHtml al pintar los datos y resalta la fila del usuario nuevo con una clase de animación."
import { usuarios } from "./datos.js";
import { escaparHtml, mostrarAviso, siguienteId } from "./utils.js";
import "./nav.js"; // muestra el correo de la persona logueada en la barra

// 1. Localizamos los elementos de la página
const formulario = document.getElementById("form-usuario");
const aviso = document.getElementById("aviso-usuarios");
const cuerpo = document.getElementById("tabla-usuarios");
const contador = document.getElementById("contador-usuarios");
const sinUsuarios = document.getElementById("sin-usuarios");
const contenedorTabla = document.getElementById("contenedor-tabla");
const campoCorreo = formulario.elements.correo;
const campoNativo = formulario.elements.nativo;
const campoAprende = formulario.elements.aprende;
const errorCorreo = document.getElementById("error-correo");
const errorAprende = document.getElementById("error-aprende");
const textoErrorCorreo = errorCorreo.textContent;
const textoErrorAprende = errorAprende.textContent;
const nombreBaja = document.getElementById("nombre-baja");
const botonConfirmar = document.getElementById("confirmar-baja");
// "bootstrap" viene del script bundle que carga la página antes que este módulo
const modalBaja = new bootstrap.Modal(document.getElementById("modal-baja"));

let idNuevo = null;      // id del usuario recién creado (para resaltar su fila)
let idPendiente = null;  // id del usuario que se quiere dar de baja

// 2. Pinta la tabla entera a partir del array usuarios
function pintarTabla() {
  cuerpo.innerHTML = "";
  usuarios.forEach((u) => {
    const fila = document.createElement("tr");
    fila.dataset.id = u.id;
    if (u.id === idNuevo) fila.className = "fila-nueva table-success";
    fila.innerHTML = `
      <td><strong>${escaparHtml(u.nombre)}</strong>${u.id === idNuevo ? ' <span class="badge text-bg-primary ms-1">Nuevo</span>' : ""}</td>
      <td>${escaparHtml(u.email)}</td>
      <td><span class="badge text-bg-success">${escaparHtml(u.idiomaNativo)}</span></td>
      <td><span class="badge text-bg-warning">${escaparHtml(u.idiomaAprende)}</span></td>
      <td class="text-end">
        <button type="button" class="btn btn-sm btn-outline-danger" data-baja="${u.id}">Dar de baja</button>
      </td>`;
    cuerpo.appendChild(fila);
  });
  contador.textContent = usuarios.length;
  // Si no hay usuarios, mostramos el mensaje de "vacío" en lugar de la tabla
  const hayUsuarios = usuarios.length > 0;
  contenedorTabla.classList.toggle("d-none", !hayUsuarios);
  sinUsuarios.classList.toggle("d-none", hayUsuarios);
}

// 3. Comprobaciones propias (las que HTML no sabe hacer por sí solo)
function validarCampos() {
  const correo = campoCorreo.value.trim().toLowerCase();
  const repetido = usuarios.some((u) => u.email.toLowerCase() === correo);
  campoCorreo.setCustomValidity(repetido ? "repetido" : "");
  errorCorreo.textContent = repetido ? "Ese correo ya está registrado." : textoErrorCorreo;

  const igual = campoNativo.value !== "" && campoNativo.value === campoAprende.value;
  campoAprende.setCustomValidity(igual ? "igual" : "");
  errorAprende.textContent = igual ? "Debe ser distinto del idioma nativo." : textoErrorAprende;
}

// 4. Alta: al enviar el formulario
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  validarCampos();
  if (!formulario.checkValidity()) {
    formulario.classList.add("was-validated"); // activa los avisos rojos de Bootstrap
    return;
  }
  const nuevo = {
    id: siguienteId(usuarios),
    nombre: formulario.elements.nombre.value.trim(),
    email: campoCorreo.value.trim().toLowerCase(),
    password: formulario.elements.clave.value,
    idiomaNativo: campoNativo.value,
    idiomaAprende: campoAprende.value,
  };
  usuarios.push(nuevo);
  idNuevo = nuevo.id;
  pintarTabla();
  mostrarAviso(aviso, `${nuevo.nombre} se ha dado de alta correctamente.`, "success");
  formulario.reset();
  formulario.classList.remove("was-validated");
});

// 5. Si la persona corrige un campo, volvemos a comprobar al momento
[campoCorreo, campoNativo, campoAprende].forEach((campo) => {
  campo.addEventListener("input", validarCampos);
  campo.addEventListener("change", validarCampos);
});

// 6. Baja: un solo listener en la tabla para todos los botones (delegación de eventos)
cuerpo.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-baja]");
  if (!boton) return;
  idPendiente = Number(boton.dataset.baja);
  const usuario = usuarios.find((u) => u.id === idPendiente);
  nombreBaja.textContent = usuario.nombre; // textContent no interpreta HTML: es seguro
  modalBaja.show();
});

botonConfirmar.addEventListener("click", () => {
  const posicion = usuarios.findIndex((u) => u.id === idPendiente);
  if (posicion !== -1) {
    const [borrado] = usuarios.splice(posicion, 1); // quitamos 1 elemento de la lista
    mostrarAviso(aviso, `${borrado.nombre} se ha dado de baja.`, "warning");
    if (idNuevo === borrado.id) idNuevo = null;
  }
  idPendiente = null;
  modalBaja.hide();
  pintarTabla();
});

// 7. La primera vez que se abre la página, pintamos la lista
pintarTabla();
