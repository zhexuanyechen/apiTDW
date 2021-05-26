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
//btn login/logout/signup
const loginbtn = document.getElementById("loginNav");
const logoutbtn = document.getElementById("logout");
const signupbtn = document.getElementById("signupNav");
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


function Persona(id, nombre, fecha_nac, fecha_muerto, img, wiki, entidades, productos) {
    this.id = id;
    this.nombre = nombre;
    this.fecha_nac = fecha_nac;
    this.fecha_def = fecha_muerto;
    this.imagen = img;
    this.wiki = wiki;
    this.tipo = "personas";
    this.entidades = entidades;
    this.productos = productos;
}

function Entidad(id, nombre, fecha_inic, fecha_fin, img, wiki, personas, productos) {
    this.id = id;
    this.nombre = nombre;
    this.fecha_nac = fecha_inic;
    this.fecha_def = fecha_fin;
    this.imagen = img;
    this.wiki = wiki;
    this.tipo = "entidades";
    this.personas = personas;
    this.productos = productos;
}

function Producto(id, nombre, fecha_inic, fecha_fin, img, wiki, personas, entidades) {
    this.id = id;
    this.nombre = nombre;
    this.fecha_nac = fecha_inic;
    this.fecha_def = fecha_fin;
    this.imagen = img;
    this.wiki = wiki;
    this.tipo = "producto";
    this.personas = personas;
    this.entidades = entidades;
}

function borrar(elem) {
    let elemId = elem.parentNode.parentNode.id;
    let borrarElem = localArray.map(function (item) {
        return item.id;
    }).indexOf(elemId);

    document.getElementById(elemId).style.display = "none";
    localArray.splice(borrarElem, 1);
    console.log(localArray);
    localStorage.setItem("cargaArray", JSON.stringify(localArray));
}

document.querySelectorAll(".borrar").forEach(item => {
    item.addEventListener("click", function () {
        borrar(this);
    })
});

document.querySelectorAll(".editar").forEach(item => {
    item.addEventListener("click", function () {
        editar(this);
    })
});