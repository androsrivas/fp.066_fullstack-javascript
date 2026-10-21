// js/nav.js
// Barra de navegación compartida: muestra el correo de la persona logueada en todas las páginas.
// Se guarda solo mientras la pestaña está abierta (sessionStorage), no es persistencia de datos.
/*
  PROMPTS DE IA USADOS EN ESTE ARCHIVO
  1) IA: Claude | Prompt: "¿Cómo guardo el correo de la persona que ha hecho login para mostrarlo en la barra de navegación de todas las páginas?"
  2) IA: Claude | Prompt: "Explícame la diferencia entre sessionStorage y localStorage y por qué uso sessionStorage."
  3) IA: Claude | Prompt: "Escribe un módulo ES que se ejecute solo al importarlo y que pinte el correo en la barra de navegación."
  4) IA: Claude | Prompt: "¿Cómo cambio el botón «Iniciar sesión» por «Cerrar sesión» cuando hay una persona logueada?"
*/
const CLAVE = "tandem-usuario";
const textoUsuario = document.getElementById("usuario-nav");
const botonSesion = document.querySelector("nav a.btn");

// Lee el correo guardado (si el navegador no permite guardar, devuelve "")
function leerCorreo() {
  try { return sessionStorage.getItem(CLAVE) || ""; } catch (error) { return ""; }
}

// Pinta el correo en la barra y cambia el botón entre "Iniciar sesión" y "Cerrar sesión"
export function mostrarUsuario() {
  const correo = leerCorreo();
  if (textoUsuario) textoUsuario.textContent = correo;
  if (botonSesion) {
    botonSesion.textContent = correo ? "Cerrar sesión" : "Iniciar sesión";
    botonSesion.setAttribute("href", correo ? "#" : "login.html");
  }
}

// Guarda el correo de quien se acaba de loguear
export function iniciarSesion(correo) {
  try { sessionStorage.setItem(CLAVE, correo); } catch (error) { /* sin almacenamiento: solo se verá en esta página */ }
  if (textoUsuario) textoUsuario.textContent = correo;
  mostrarUsuario();
}

// Borra la sesión
export function cerrarSesion() {
  try { sessionStorage.removeItem(CLAVE); } catch (error) { /* nada que borrar */ }
  mostrarUsuario();
}

// Al pulsar "Cerrar sesión" se borra la sesión (si no hay sesión, el enlace lleva al login)
if (botonSesion) {
  botonSesion.addEventListener("click", (evento) => {
    if (leerCorreo()) {
      evento.preventDefault();
      cerrarSesion();
    }
  });
}

// Al cargar cualquier página, mostramos el usuario si ya había iniciado sesión
mostrarUsuario();
