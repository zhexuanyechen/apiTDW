let authHeader = null;
const productosId = document.getElementById("productosCol");
const entidadesId = document.getElementById("entidadesCol");
const personasId = document.getElementById("personasCol");
let array = [];
//const documento = document.documentElement;
//const loginbtn = document.getElementById("loginNav");
//const logoutbtn = document.getElementById("logout");

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
            existeUser(authHeader, user);
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
            datos.entities.forEach((entidad)=>{
                let entityAux = entidad.entity;
                let nuevaEnt = new Entidad(entityAux.id + "ent", entityAux.name, entityAux.birthDate, entityAux.deathDate,
                    entityAux.imageUrl, entityAux.wikiUrl, entityAux.persons, entityAux.products);
                cargarObjetos(entidadesId, nuevaEnt);
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
            });
        }
    });
}

function  cargarAjaxProd(){
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
            });
        }
    });
}

$(document).ready(function(){
    cargarAjax();
})

function existeUser(authHeader, username) {
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
                    console.log("Es escritor");
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