
export const usuarios = [
    { id: 1, nombre: "Laura García", email: "laura@tandem.com", password: "1234" },
    { id: 2, nombre: "John Smith", email: "john@tandem.com", password: "1234" },
    { id: 3, nombre: "Marta Ruiz", email: "marta@tandem.com", password: "1234" },
];

export const intercambios = [
    { id: 1, tipo: "oferta", titulo: "Conversación en inglés", idioma: "Inglés", nivel: "B2", descripcion: "", autor: "laura@tandem.com" },
    { id: 2, tipo: "peticion", titulo: "Busco practicar catalán", idioma: "Catalán", nivel: "A2", descripcion: "", autor: "john@tandem.com" },
    { id: 3, tipo: "peticion", titulo: "Japonés desde cero", idioma: "Japonés", nivel: "A1", descripcion: "", autor: "marta@tandem.com" },
];

// Guarda quién está logueado. 
export const sesion = {
    usuario: null,
};


export const idiomas = ["Alemán", "Catalán", "Español", "Francés", "Inglés", "Italiano", "Japonés", "Portugués"];
export const niveles = ["A1", "A2", "B1", "B2", "C1", "C2"];