import { intercambios, usuarios, sesion, idiomas, niveles } from "./data.js";

// sin persistencia no hay sesión compartida entre páginas, así qu aquí simulamos que Laura ya ha iniciado sesión
sesion.usuario = usuarios[0];
document.getElementById("navCorreo").textContent = sesion.usuario.email;

const form = document.getElementById("formIntercambio");
const titulo = document.getElementById("titulo");
const idioma = document.getElementById("idioma");
const nivel = document.getElementById("nivel");
const descripcion = document.getElementById("descripcion");
const errorTipo = document.getElementById("errorTipo");
const zonaAlerta = document.getElementById("zonaAlerta");

const tbody = document.getElementById("tbody");
const tarjetas = document.getElementById("tarjetas");
const listado = document.getElementById("listado");
const contador = document.getElementById("contador");
const botonesFiltro = document.querySelectorAll("#filtros button");
const vacio = document.getElementById("vacio");

const elementoModal = document.getElementById("modalBaja");
const modalBaja = new bootstrap.Modal(elementoModal);

let filtro = "todos";
let idNuevo = null;
let idEnBaja = null;

idiomas.forEach((i) => idioma.add(new Option(i, i)));
niveles.forEach((n) => nivel.add(new Option(n, n)));

const esc = (texto) =>
    texto.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function etiquetaTipo(tipo) {
    return tipo === "oferta"
        ? '<span class="badge rounded-pill pill-oferta">Oferta</span>'
        : '<span class="badge rounded-pill pill-peticion">Petición</span>';
}

function claseFila(i) {
    if (i.id === idNuevo) return "fila-nueva";
    if (i.id === idEnBaja) return "fila-baja";
    return "";
}

function insigniaNuevo(i) {
    return i.id === idNuevo ? ' <span class="badge rounded-pill text-bg-success ms-1">Nuevo</span>' : "";
}

function filaTabla(i) {
    return `
    <tr class="${claseFila(i)}">
      <td class="ps-4">${etiquetaTipo(i.tipo)}</td>
      <td>
        <div class="fw-semibold">${esc(i.titulo)}${insigniaNuevo(i)}</div>
        <small class="text-secondary">${esc(i.autor)}</small>
      </td>
      <td>${esc(i.idioma)}</td>
      <td><span class="badge rounded-pill text-bg-light border">${i.nivel}</span></td>
      <td class="text-end pe-4">
        <button type="button" class="btn btn-outline-danger btn-sm" data-baja="${i.id}">Dar de baja</button>
      </td>
    </tr>`;
}

function tarjeta(i) {
    return `
    <div class="tarjeta-intercambio card border shadow-sm rounded-4 p-3 mb-2 ${claseFila(i)}">
      <div>${etiquetaTipo(i.tipo)}${insigniaNuevo(i)}</div>
      <h3 class="h6 fw-semibold mt-2 mb-0">${esc(i.titulo)}</h3>
      <small class="text-secondary mb-2">${esc(i.autor)}</small>
      <div class="d-flex gap-2 mb-3">
        <span class="badge rounded-pill text-bg-light border">${esc(i.idioma)}</span>
        <span class="badge rounded-pill text-bg-light border">Nivel ${i.nivel}</span>
      </div>
      <button type="button" class="btn btn-outline-danger btn-sm w-100" data-baja="${i.id}">Dar de baja</button>
    </div>`;
}

function pintar() {
    const lista = intercambios.filter((i) => filtro === "todos" || i.tipo === filtro);

    contador.textContent = lista.length;
    botonesFiltro.forEach((b) => {
        const activo = b.dataset.filtro === filtro;
        b.classList.toggle("btn-primary", activo);
        b.classList.toggle("btn-outline-secondary", !activo);
    });

    listado.classList.toggle("d-none", lista.length === 0);
    vacio.classList.toggle("d-none", lista.length > 0);
    if (lista.length === 0) {
        const hayDatos = intercambios.length > 0;
        document.getElementById("vacioTitulo").textContent = hayDatos
            ? "No hay resultados"
            : "Todavía no hay intercambios";
        document.getElementById("vacioTexto").textContent = hayDatos
            ? "Prueba con otro filtro."
            : "Cuando publiques el primero con el formulario de arriba, aparecerá aquí.";
    }

    tbody.innerHTML = lista.map(filaTabla).join("");
    tarjetas.innerHTML = lista.map(tarjeta).join("");
}

function mostrarAlerta(tipo, texto) {
    zonaAlerta.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>`;
}

function marcar(campo, invalido) {
    campo.classList.toggle("is-invalid", invalido);
    return invalido;
}

function quitarErrores() {
    [titulo, idioma, nivel].forEach((c) => c.classList.remove("is-invalid"));
    errorTipo.classList.add("d-none");
}

function validar() {
    const tipo = form.querySelector('input[name="tipo"]:checked');
    errorTipo.classList.toggle("d-none", tipo !== null);

    const errores = [
        tipo === null,
        marcar(titulo, titulo.value.trim() === ""),
        marcar(idioma, idioma.value === ""),
        marcar(nivel, nivel.value === ""),
    ];
    return errores.filter(Boolean).length;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fallos = validar();
    if (fallos > 0) {
        mostrarAlerta("danger", fallos === 1
            ? "Revisa el campo marcado en rojo antes de publicar."
            : `Revisa los ${fallos} campos marcados en rojo antes de publicar.`);
        return;
    }

    const nuevo = {
        id: Math.max(0, ...intercambios.map((i) => i.id)) + 1,
        tipo: form.querySelector('input[name="tipo"]:checked').value,
        titulo: titulo.value.trim(),
        idioma: idioma.value,
        nivel: nivel.value,
        descripcion: descripcion.value.trim(),
        autor: sesion.usuario.email,
    };

    intercambios.unshift(nuevo);
    idNuevo = nuevo.id;
    filtro = "todos";

    form.reset();
    quitarErrores();
    mostrarAlerta("success", "Intercambio publicado correctamente");
    pintar();
});

form.addEventListener("reset", () => {
    quitarErrores();
    zonaAlerta.innerHTML = "";
});

[titulo, idioma, nivel].forEach((c) =>
    c.addEventListener("input", () => c.classList.remove("is-invalid"))
);
form.querySelectorAll('input[name="tipo"]').forEach((r) =>
    r.addEventListener("change", () => errorTipo.classList.add("d-none"))
);

document.getElementById("filtros").addEventListener("click", (e) => {
    const boton = e.target.closest("button");
    if (!boton) return;
    filtro = boton.dataset.filtro;
    pintar();
});

listado.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-baja]");
    if (!boton) return;

    idEnBaja = Number(boton.dataset.baja);
    const intercambio = intercambios.find((i) => i.id === idEnBaja);
    document.getElementById("modalBajaTitulo").textContent = `¿Dar de baja «${intercambio.titulo}»?`;
    pintar();
    modalBaja.show();
});

document.getElementById("confirmarBaja").addEventListener("click", () => {
    // splice porque intercambios es const: se modifica, no se reasigna
    const posicion = intercambios.findIndex((i) => i.id === idEnBaja);
    intercambios.splice(posicion, 1);
    idEnBaja = null;
    modalBaja.hide();
    mostrarAlerta("success", "Intercambio dado de baja");
    pintar();
});

elementoModal.addEventListener("hidden.bs.modal", () => {
    idEnBaja = null;
    pintar();
});

pintar();