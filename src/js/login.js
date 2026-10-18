
import { usuarios, sesion } from "./data.js";
const formLogin = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const alertaError = document.getElementById("alertaError");
const vistaLogin = document.getElementById("vistaLogin");
const vistaSesion = document.getElementById("vistaSesion");
const navCorreo = document.getElementById("navCorreo");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const textoSesion = document.getElementById("textoSesion");
const saludo = document.getElementById("saludo");

//Busca un usuario con ese correo y contraseña. Devuelve el objeto o undefined.
function buscarUsuario(email, password) {
    return usuarios.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
}

//"sesión iniciada" o "sin sesión"
function pintarEstado() {
    const logueado = sesion.usuario !== null;

    //formulario
    vistaLogin.classList.toggle("d-none", logueado);
    vistaSesion.classList.toggle("d-none", !logueado);

    //correo del usuario + botón de cerrar sesión
    navCorreo.classList.toggle("d-none", !logueado);
    btnCerrarSesion.classList.toggle("d-none", !logueado);

    if (logueado) {
        navCorreo.textContent = sesion.usuario.email;
        textoSesion.textContent = "Sesión iniciada como " + sesion.usuario.email;
        saludo.textContent = "¡Hola, " + sesion.usuario.nombre.split(" ")[0] + "!";
    }
}

//Al enviar el formulario
formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evita que la página se recargue

    // Validación de Bootstrap
    formLogin.classList.add("was-validated");
    alertaError.classList.add("d-none");
    if (!formLogin.checkValidity()) return; // hay campos vacíos o email mal escrito

    const usuario = buscarUsuario(inputEmail.value, inputPassword.value);

    if (usuario) {
        sesion.usuario = usuario;       // guardamos quién está logueado
        formLogin.reset();
        formLogin.classList.remove("was-validated");
        pintarEstado();
    } else {

        formLogin.classList.remove("was-validated");
        alertaError.classList.remove("d-none");
    }
});

//Cerrar sesión
btnCerrarSesion.addEventListener("click", () => {
    sesion.usuario = null;
    pintarEstado();
});

//Estado inicial al cargar la página
pintarEstado();