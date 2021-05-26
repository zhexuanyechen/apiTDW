let authHeader = null;
const productosId = document.getElementById("productosCol");
const entidadesId = document.getElementById("entidadesCol");
const personasId = document.getElementById("personasCol");
let array = [];

$("#login").click(function(){
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
            sessionStorage.setItem("logueado", "true");
            showBtn();
        }
    });
});

//function showData(authHeader) {
    //showToken(authHeader);
    //cargarAjax(authHeader);
    //showUsers(authHeader);
//}

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
            console.log(datos);
            datos.entities.forEach((entidad)=>{
                let entityAux = entidad.entity;
                let nuevaEnt = new Entidad(entityAux.id + "ent", entityAux.name, entityAux.birthDate, entityAux.deathDate,
                    entityAux.imageUrl, entityAux.wikiUrl, entityAux.persons, entityAux.products);
                cargarObjetos(entidadesId, nuevaEnt);
                console.log(nuevaEnt);
            });
        }
    });
}

function  cargarAjaxPersonas(){
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        success: function (data) {
            console.log(data);
            data.persons.forEach((persona)=>{
                let personAux = persona.person;
                let nuevaPersona = new Persona(personAux.id + "pers", personAux.name, personAux.birthDate, personAux.deathDate,
                    personAux.imageUrl, personAux.wikiUrl, personAux.entities, personAux.products);
                cargarObjetos(personasId, nuevaPersona);
                console.log(nuevaPersona);
            });
        }
    });
}

function  cargarAjaxProd(){
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        success: function (data) {
            console.log(data);
            $('#products').html(JSON.stringify(data));
            data.products.forEach((producto)=>{
                let prodAux = producto.product;
                let nuevoProd = new Producto(prodAux.id + "prod", prodAux.name, prodAux.birthDate, prodAux.deathDate,
                    prodAux.imageUrl, prodAux.wikiUrl, prodAux.persons, prodAux.entities);
                cargarObjetos(productosId, nuevoProd);
                console.log(nuevoProd);
            });
        }
    });
}

$(document).ready(function(){
    cargarAjax();
})


function showUsers(authHeader) {
    $.ajax({
        type: "GET",
        url: '/api/v1/users',
        headers: {"Authorization": authHeader},
        // dataType: 'json',
        success: function (data) {
            $('#users').html(JSON.stringify(data));
        }
    })
}