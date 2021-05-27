function login(){
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
}

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
            entidadesId.innerHTML="";
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

function cargarAjaxPersonas(){
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        success: function (data) {
            personasId.innerHTML="";
            data.persons.forEach((persona)=>{
                let personAux = persona.person;
                let nuevaPersona = new Persona(personAux.id + "pers", personAux.name, personAux.birthDate, personAux.deathDate,
                    personAux.imageUrl, personAux.wikiUrl, personAux.entities, personAux.products);
                cargarObjetos(personasId, nuevaPersona);
                addClickListener("#personasCol .imagen", "persons");
                arrayPersonas.push(nuevaPersona);
            });
            console.log("he terminado");
        }
    });
}

function cargarAjaxProd(){
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        success: function (data) {
            productosId.innerHTML="";
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

function cargarObjetos(id, objeto) {
    let htmlId = id;
    htmlId.innerHTML += `<div id='${objeto.id}' class='card mb-3'><img src='${objeto.imageUrl}' class='card-img-top imagen'>
        <div class='card-body'><h5 class='card-title text-center'>${objeto.name}</h5></div>
        <div class='mb-2 botonesObjeto'><button type='button' class='btn red borrar'>Borrar</button>
        <button type='button' class='btn editar' data-bs-toggle='modal' data-bs-target='#modalFormulario'>Editar</button></div></div>`;
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
            descripcion(datosAux);
            modalForm.show();
        }
    });
}
function descripcion(datosAux){
    let html =`<div class="modal-header">
                   <h3 class="modal-title">Descripcion de ${datosAux.name}</h3>
                   <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form class="modal-body">
                  ${imprimirDesc(datosAux)}
                </form>
                <div id="mFooter2" class="modal-footer">
                   <button type="button" class="btn red" data-bs-dismiss="modal">Cerrar</button>
                </div>`;
    contenidoFormAdd.innerHTML=html;
}
function imprimirDesc(datosAux){
    let html='';
    for(let atributo in datosAux){
        if (atributo === "products" || atributo === "persons" || atributo === "entities") {
            let id = "lista" + atributo;
            html += `<div class='mb-2'><h4>${atributo}</h4><ul class='datos' id='${id}'>`;
            if(datosAux[atributo] === null){
                html += "Sin relaciones</ul></div>";
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
                    html += `<li>${aux.name}</li>`;
                }
                html+="</ul></div>";
            }
        } else if (atributo === "wikiUrl") {
            html += `<div class='mb-2 wiki'><h4>${atributo}</h4><a href='${datosAux[atributo]}' class='datos' target='_blank'>${datosAux[atributo]}</a></div>`;
        } else if (atributo !== "id"){
            html += `<div class='mb-2'><h4>${atributo}</h4><p class='datos'>${datosAux[atributo]}</p></div>`;
        }
    }
    return html;
}

function addClickListener(selector, tipo){
    document.querySelectorAll(selector).forEach(item => {
        item.addEventListener("click", function (event) {
            let prodId = event.target.parentNode.id;
            console.log(prodId + " " + prodId.slice(0, -4));
            showDescAjax(prodId.slice(0, -4), tipo);
        });
        item.addEventListener("error", function () {
            item.src = "./iconos/not-found-image.jpg";
        })
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
                    userid=usuarioEncontrado.user.id;
                    botonBorrar();
                    botonEditar();
                }else if(usuarioEncontrado != null && usuarioEncontrado.user.role !== "writer"){
                    sessionStorage.setItem("logueado", "true");
                    sessionStorage.setItem("role", "reader");
                    console.log("Es reader");
                    showBtn();
                    userid=usuarioEncontrado.user.id;
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
    console.log(role);
    if (logueado === "true" && role === "writer") {
        for (let i = 0; i < displaybtn.length; i++) {
            displaybtn[i].style.display = "flex";
        }
        loginbtn.style.display = "none";
        logoutbtn.style.display = "inline-block";
        signupbtn.style.display = "none";
        documento.style.setProperty("--displayCrear", "block");
        botonesCrear.forEach((botonCrear)=>{
            botonCrear.addEventListener("click", (e)=>{
                console.log(e.target.id);
                crear(e.target.id);
            });
        });
    } else {
        for (let i = 0; i < displaybtn.length; i++) {
            displaybtn[i].style.display = "none";
        }
        loginbtn.style.display = "inline-block";
        logoutbtn.style.display = "none";
        signupbtn.style.display = "inline-block";
        documento.style.setProperty("--displayCrear", "none");
    }
}

function logout() {
    sessionStorage.setItem("logueado", "false");
}

logoutbtn.addEventListener("click", () => {
    logout();
    showBtn();
});

loginbtn.addEventListener("click", ()=>{
        let html =`  <div class="modal-header">
                            <h3 class="modal-title">Login</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                     </div>
                     <form class="modal-body">
                        <div class="mb-2">
                            <img class="loginImg" src="iconos/user.png" class="me-2">
                        </div>
                        <div class="mb-2">
                            <label for="usuario" class="form-label">Usuario</label>
                            <input type="text" class="form-control" placeholder="Usuario" id="usuario">
                        </div>
                        <div class="mb-2">
                            <label for="pwd" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" placeholder="Contraseña" id="pwd">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn red" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" id="login" class="btn loginbtn"><img
                                    src="iconos/user.png" class="me-2">Login</button>
                        </div>
                     </form>
                `;
    contenidoLogin.innerHTML=html;
    $("#login").click((e)=>{
        e.preventDefault();
        login();
    });
    modalLogin.show();
});

signupbtn.addEventListener("click", ()=>{
    let html=`<div class="modal-header">
                        <h3 class="modal-title">Sign up</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="signupForm" class="modal-body">
                        <div class="mb-2">
                            <img class="loginImg" src="iconos/user.png" class="me-2">
                        </div>
                        <div class="mb-2">
                            <label for="email" class="form-label">Email</label>
                            <input type="text" class="form-control" placeholder="Email" id="email">
                        </div>
                        <div class="mb-2">
                            <label for="usuario" class="form-label">Usuario</label>
                            <input type="text" class="form-control" placeholder="Usuario" id="usuario">
                        </div>
                        <div class="mb-2">
                            <label for="pwd" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" placeholder="Contraseña" id="pwd">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn red" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" id="signup" class="btn loginbtn" disabled><img
                                    src="iconos/user.png" class="me-2">Sign up</button>
                        </div>
                        <p id="pError">No hay errores</p>
                    </form>`;
    contenidoLogin.innerHTML=html;
    document.querySelectorAll("#signupForm input").forEach(function (input) {
        input.addEventListener("keyup", ()=>{
            validacionFormulario(document.querySelectorAll("#signupForm input"), document.getElementById("signup"));
        });
    });
    $("#signup").click((e)=>{
        e.preventDefault();
        signup();
    });
    modalLogin.show();
});

editarbtn.addEventListener("click", ()=>{
    let html=`<div class="modal-header">
                        <h3 class="modal-title">Sign up</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="signupForm" class="modal-body">
                        <div class="mb-2">
                            <img class="loginImg" src="iconos/user.png" class="me-2">
                        </div>
                        <div class="mb-2">
                            <label for="email" class="form-label">Email</label>
                            <input type="text" class="form-control" placeholder="Email" id="email">
                        </div>
                        <div class="mb-2">
                            <label for="usuario" class="form-label">Usuario</label>
                            <input type="text" class="form-control" placeholder="Usuario" id="usuario">
                        </div>
                        <div class="mb-2">
                            <label for="pwd" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" placeholder="Contraseña" id="pwd">
                        </div>
                        <div class="mb-2">
                            <label for="fechanac" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" placeholder="Fecha nacimiento" id="fechanac">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn red" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" id="signup" class="btn loginbtn" disabled><img
                                    src="iconos/user.png" class="me-2">Sign up</button>
                        </div>
                        <p id="pError">No hay errores</p>
                    </form>`;
    contenidoLogin.innerHTML=html;
    document.querySelectorAll("#signupForm input").forEach(function (input) {
        input.addEventListener("keyup", ()=>{
            validacionFormulario(document.querySelectorAll("#signupForm input"), document.getElementById("signup"));
        });
    });
    $("#signup").click((e)=>{
        e.preventDefault();
        signup();
    });
    modalLogin.show();
});

function signup(){
    let user = $("#usuario").val();
    let pwd = $("#pwd").val();
    let email = $("#email").val();

    $.ajax({
        type: "POST",
        url: "/api/v1/users",
        data: {username: user, email: email, password:pwd, role:"reader"},
        cache: false,
        success: function (data, textStatus){
            console.log(textStatus);
            login();
            modalLogin.hide();
        },
        statusCode:{
            400: function () {
                document.getElementById("pError").innerText = "Ya existe este usuario o email";
            }
        }
    });
};

function actualizarUser(){
    let user = $("#usuario").val();
    let pwd = $("#pwd").val();
    let email = $("#email").val();
    let fechanac = $("#fechanac").val();
    let dataString = JSON.stringify({username: user, email: email, password:pwd, role:"reader", activo:"activo", fechanac:fechanac});

    $.ajax({
        type: "PUT",
        url: "/api/v1/users/"+userid,
        data: dataString,
        cache: false,
        success: function (data, textStatus){
            modalLogin.hide();
        }
    });
}

function validacionFormulario(formulario, boton) {
    let completado = 0;
    formulario.forEach(function (input) {
        if (input.value.trim() === "") {
            boton.disabled = true;
        } else {
            completado++;
        }
    });
    if (completado === 3) {
        boton.disabled = false;
    }
}


