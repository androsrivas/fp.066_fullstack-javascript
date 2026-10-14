// js/datos.js
// Aquí viven TODOS los datos de ejemplo de la aplicación.
// Son listas (arrays) de objetos. No se guardan al recargar la página.
//
// NORMAS PARA TODO EL EQUIPO
// 1) No cambiéis el nombre ni las claves de los objetos sin avisar a Persona 1.
// 2) Para AÑADIR: lista.push(objeto).  Para QUITAR: lista.splice(posicion, 1).
//    No se puede escribir "usuarios = ..." desde otro archivo, porque una
//    lista importada con "export const" no se puede reemplazar (sí modificar).
// 3) Cada objeto tiene un "id" único. Para uno nuevo usad siguienteId(lista) de utils.js.

export const usuarios = [
  { id: 1, nombre: "Laura Puig", email: "laura@tandem.com", password: "1234",
    idiomaNativo: "Español", idiomaAprende: "Inglés" },
  { id: 2, nombre: "John Smith", email: "john@tandem.com", password: "abcd",
    idiomaNativo: "Inglés", idiomaAprende: "Español" },
  { id: 3, nombre: "Aya Tanaka", email: "aya@tandem.com", password: "5678",
    idiomaNativo: "Japonés", idiomaAprende: "Catalán" },
];

export const intercambios = [
  { id: 1, tipo: "oferta", idioma: "Inglés", nivel: "C1", modalidad: "Online",
    titulo: "Conversación en inglés los martes",
    descripcion: "Practico inglés una hora por videollamada a cambio de practicar español.",
    autor: "john@tandem.com" },
  { id: 2, tipo: "peticion", idioma: "Catalán", nivel: "A2", modalidad: "Presencial",
    titulo: "Busco practicar catalán en el centro cívico",
    descripcion: "Quedada semanal para hablar catalán en un ambiente relajado.",
    autor: "aya@tandem.com" },
  { id: 3, tipo: "oferta", idioma: "Español", nivel: "Nativo", modalidad: "Presencial",
    titulo: "Intercambio español-inglés en la biblioteca",
    descripcion: "Sesiones de 45 minutos. Se necesita un nivel mínimo B1 de inglés.",
    autor: "laura@tandem.com" },
  { id: 4, tipo: "peticion", idioma: "Inglés", nivel: "B1", modalidad: "Online",
    titulo: "Quiero perder el miedo a hablar inglés",
    descripcion: "Busco a alguien paciente para charlar por videollamada dos veces por semana.",
    autor: "laura@tandem.com" },
];