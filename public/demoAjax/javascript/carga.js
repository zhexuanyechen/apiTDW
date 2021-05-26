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

function cargarObjetos(id, objeto) {
    let htmlId = id;
    htmlId.innerHTML += `<div id='${objeto.id}' class='card mb-3'><img src='${objeto.imagen}' class='card-img-top imagen'>
        <div class='card-body'><h5 class='card-title text-center'>${objeto.nombre}</h5></div>
        <div class='mb-2 botonesObjeto'><button type='button' class='btn red borrar'>Borrar</button>
        <button type='button' class='btn editar' data-bs-toggle='modal' data-bs-target='#modalFormulario'>Editar</button></div></div>`;
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