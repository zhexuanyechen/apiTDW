let authHeader = null;
const productosId = document.getElementById("productosCol");
const entidadesId = document.getElementById("entidadesCol");
const personasId = document.getElementById("personasCol");
let arrayEntidades = [], arrayPersonas =[], arrayProductos=[];
const documento = document.documentElement;
const loginbtn = document.getElementById("loginNav");
const logoutbtn = document.getElementById("logout");
const modalLogin = new bootstrap.Modal(document.getElementById("modalLogin"), {
    keyboard: false,
    focus: true
});
const modalForm= new bootstrap.Modal(document.getElementById("modalFormulario"), {
    keyboard: false,
    focus: true
});

$("#login").click(function(e){
    e.preventDefault();
    let user = $("#usuario").val();
    let pwd = $("#pwd").val();
    let dataString = "username="+user+"&password="+pwd;
    $.ajax({
        type: "POST",
        url: "/access_token",
        data: dataString,
        cache: false,
        success: function (data, textStatus, request){
            authHeader = request.getResponseHeader('Authorization');
            console.log(data);
            console.log("holiwi");
            rolUser(authHeader, user);
            modalLogin.hide();
        }
    });
});

function showToken(authHeader) {
    let token = authHeader.split(' ')[1];   // Elimina 'Bearer '
    let myData = JSON.parse(atob(token.split('.')[1]));
    $('#mytoken').html(
        "User: " + JSON.stringify(myData.sub) +
        " - JWT Scopes: " + JSON.stringify(myData.scopes)
    );
}

function cargarAjax() {
    cargarAjaxProd();
    cargarAjaxPersonas();
    cargarAjaxEntidades();
}

function cargarAjaxEntidades(){
    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        success: function (datos) {
            datos.entities.forEach((entidad)=>{
                let entityAux = entidad.entity;
                let nuevaEnt = new Entidad(entityAux.id + "enti", entityAux.name, entityAux.birthDate, entityAux.deathDate,
                    entityAux.imageUrl, entityAux.wikiUrl, entityAux.persons, entityAux.products);
                cargarObjetos(entidadesId, nuevaEnt);
                addClickListener("#entidadesCol .imagen", "entities");
                arrayEntidades.push(nuevaEnt);
            });
        }
    });
}

function  cargarAjaxPersonas(){
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        success: function (data) {
            data.persons.forEach((persona)=>{
                let personAux = persona.person;
                let nuevaPersona = new Persona(personAux.id + "pers", personAux.name, personAux.birthDate, personAux.deathDate,
                    personAux.imageUrl, personAux.wikiUrl, personAux.entities, personAux.products);
                cargarObjetos(personasId, nuevaPersona);
                addClickListener("#personasCol .imagen", "persons");
                arrayPersonas.push(nuevaPersona);
            });
        }
    });
}

function cargarAjaxProd(){
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        success: function (data) {
            $('#products').html(JSON.stringify(data));
            data.products.forEach((producto)=>{
                let prodAux = producto.product;
                let nuevoProd = new Producto(prodAux.id + "prod", prodAux.name, prodAux.birthDate, prodAux.deathDate,
                    prodAux.imageUrl, prodAux.wikiUrl, prodAux.persons, prodAux.entities);
                cargarObjetos(productosId, nuevoProd);
                addClickListener("#productosCol .imagen", "products");
                arrayProductos.push(nuevoProd);
            });
        }
    });
}

$(document).ready(function(){
    cargarAjax();
});

function showDescAjax(prodId, tipo){
    $.ajax({
        type: "GET",
        url: `/api/v1/${tipo}/${prodId}`,
        success: function (data) {
            let datosAux = "";
            if(tipo === "products")
                datosAux = data.product;
            else if(tipo === "entities")
                datosAux = data.entity;
            else if(tipo === "persons")
                datosAux = data.person;

            console.log(datosAux);
            mBodyFormulario.innerHTML = "";
            for(let atributo in datosAux){
                if (atributo === "products" || atributo === "persons" || atributo === "entities") {
                    let id = "lista" + atributo;
                    mBodyFormulario.innerHTML += `<div class='mb-2'><h4>${atributo}</h4><ul class='datos' id='${id}'></ul></div>`;

                    if(datosAux[atributo] === null){
                        document.getElementById(id).innerText = "Sin relaciones";
                    }else{
                        for (let i = 0; i < datosAux[atributo].length; i++) {
                            let aux = "";
                            if (atributo === "products") {
                                aux = arrayProductos.find(producto => producto.id.slice(0, -4) == datosAux[atributo][i]);
                            }else if (atributo === "entities"){
                                aux = arrayEntidades.find(entidad => entidad.id.slice(0, -4) == datosAux[atributo][i]);
                            }else if (atributo === "persons"){
                                aux = arrayPersonas.find(persona => persona.id.slice(0, -4) == datosAux[atributo][i]);
                            }
                            document.getElementById(id).innerHTML += `<li>${aux.nombre}</li>`;
                        }
                    }
                } else if (atributo === "wikiUrl") {
                    mBodyFormulario.innerHTML += `<div class='mb-2 wiki'><h4>${atributo}</h4><a href='${datosAux[atributo]}' class='datos' target='_blank'>${datosAux[atributo]}</a></div>`;
                } else if (atributo !== "id"){
                    mBodyFormulario.innerHTML += `<div class='mb-2'><h4>${atributo}</h4><p class='datos'>${datosAux[atributo]}</p></div>`;
                }
            }
            modalForm.show();
        }
    });
}
function addClickListener(selector, tipo){
    document.querySelectorAll(selector).forEach(item => {
        item.addEventListener("click", function (event) {
            let prodId = event.target.parentNode.id;
            console.log(prodId + " " + prodId.slice(0, -4));
            showDescAjax(prodId.slice(0, -4), tipo);
        });
    });
}

function rolUser(authHeader, username) {
    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": authHeader},
        success: function (data) {
            let usuarioEncontrado = data.users.find(usuario => usuario.user.username === username);
            console.log(usuarioEncontrado);
                if(usuarioEncontrado != null && usuarioEncontrado.user.role === "writer"){
                    sessionStorage.setItem("logueado", "true");
                    sessionStorage.setItem("role", "writer");
                    showBtn();
                    console.log("Es writer");
                }else if(usuarioEncontrado != null && usuarioEncontrado.user.role !== "writer"){
                    sessionStorage.setItem("logueado", "true");
                    sessionStorage.setItem("role", "reader");
                    console.log("Es reader");
                }else{
                    console.log("no se ha encontrado");
                }
        }
    })
}

function showBtn() {
    let displaybtn = document.getElementsByClassName("botonesObjeto");
    let logueado = sessionStorage.getItem("logueado");
    let role = sessionStorage.getItem("role");

    if (logueado === "true" && role === "writer") {
        for (let i = 0; i < displaybtn.length; i++) {
            displaybtn[i].style.display = "flex";
        }
        loginbtn.style.display = "none";
        logoutbtn.style.display = "block";
        documento.style.setProperty("--displayCrear", "block");
    } else {
        for (let i = 0; i < displaybtn.length; i++) {
            displaybtn[i].style.display = "none";
        }
        loginbtn.style.display = "block";
        logoutbtn.style.display = "none";
        documento.style.setProperty("--displayCrear", "none");
    }
}

function logout() {
    sessionStorage.setItem("logueado", "false");
}

document.getElementById("logout").addEventListener("click", () => {
    logout();
    showBtn();
});

showBtn();

