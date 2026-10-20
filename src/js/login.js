// js/login.js
// Comprueba el correo y la contraseña con la lista de usuarios de datos.js
/*
  PROMPTS DE IA USADOS EN ESTE ARCHIVO
  1) IA: Claude | Prompt: "¿Cómo valido un formulario con Bootstrap 5 y JS puro usando checkValidity?"
  2) IA: Claude | Prompt: "Busca un usuario en un array por correo y contraseña con find."
  3) IA: Claude | Prompt: "Explica event.preventDefault() en un evento submit."
  4) IA: Claude | Prompt: "¿Cómo muestro el correo del usuario en la barra de navegación y un aviso de error si los datos son incorrectos?"
*/
import { usuarios } from "./datos.js";
import { mostrarAviso } from "./utils.js";
// 1. Localizamos los elementos de la página
const formulario = document.getElementById("form-login");
const aviso = document.getElementById("aviso-login");
const usuarioNav = document.getElementById("usuario-nav");
// 2. Cuando se pulsa "Entrar" (evento submit) ejecutamos esta función
formulario.addEventListener("submit", (evento) => {
  // Evita que el navegador recargue la página al enviar el formulario
  evento.preventDefault();
    // 3. Validación: ¿están bien rellenados los campos?
  if (!formulario.checkValidity()) {
    formulario.classList.add("was-validated"); // activa los avisos rojos de Bootstrap
    return; // salimos: no seguimos si hay errores
  }
  // 4. Leemos lo que ha escrito la persona
  const email = formulario.elements.email.value.trim().toLowerCase();
  const password = formulario.elements.password.value;
  // 5. Buscamos en la lista un usuario con ese correo Y esa contraseña
  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );
  // 6. Si lo encontramos: éxito. Si no: error.
  if (usuario) {
    usuarioNav.textContent = usuario.email; // el correo aparece en la barra de navegación
    mostrarAviso(aviso, `¡Bienvenido/a, ${usuario.nombre}!`, "success");
    formulario.reset();
    formulario.classList.remove("was-validated");
  } else {
    usuarioNav.textContent = "";
    mostrarAviso(aviso, "Correo o contraseña incorrectos", "danger");
  }
});