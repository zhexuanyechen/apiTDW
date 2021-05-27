//authHeader de Ajax
let authHeader = null;
//columnas del html
const productosId = document.getElementById("productosCol");
const entidadesId = document.getElementById("entidadesCol");
const personasId = document.getElementById("personasCol");
//arrays donde se guardan los datos recibidos de la api con las clases correspondientes
let arrayEntidades = [], arrayPersonas =[], arrayProductos=[];
//documento
const documento = document.documentElement;
//btn login/logout/signup/crear/editar/eliminar
const loginbtn = document.getElementById("loginNav");
const logoutbtn = document.getElementById("logout");
const signupbtn = document.getElementById("signupNav");
const editarbtn = document.getElementById("editUser");
const botonesCrear = document.querySelectorAll(".crear");
//modales
const modalLogin = new bootstrap.Modal(document.getElementById("modalLogin"), {
    keyboard: false,
    focus: true
});
const modalForm= new bootstrap.Modal(document.getElementById("modalFormulario"), {
    keyboard: false,
    focus: true
});
//para guardar userid cuando se logue
let userid;
//contenido formularios modales
const contenidoLogin = document.getElementById("contenidoModalLogin");
const contenidoFormAdd = document.getElementById("modalFormAdd");
const mBodyFormulario = document.getElementById("mBodyFormulario");

function Persona(id, nombre, fecha_nac, fecha_muerto, img, wiki, entidades, productos) {
    this.id = id;
    this.name = nombre;
    this.birthDate = fecha_nac;
    this.deathDate = fecha_muerto;
    this.imageUrl = img;
    this.wikiUrl = wiki;
    this.tipo = "personas";
    this.entities = entidades;
    this.products = productos;
}

function Entidad(id, nombre, fecha_inic, fecha_fin, img, wiki, personas, productos) {
    this.id = id;
    this.name = nombre;
    this.birthDate = fecha_inic;
    this.deathDate = fecha_fin;
    this.imageUrl = img;
    this.wikiUrl = wiki;
    this.tipo = "entidades";
    this.persons = personas;
    this.products = productos;
}

function Producto(id, nombre, fecha_inic, fecha_fin, img, wiki, personas, entidades) {
    this.id = id;
    this.name = nombre;
    this.birthDate = fecha_inic;
    this.deathDate = fecha_fin;
    this.imageUrl = img;
    this.wikiUrl = wiki;
    this.tipo = "producto";
    this.persons = personas;
    this.entities = entidades;
}
