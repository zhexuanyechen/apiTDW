function cargarAjax() {
    cargarAjaxProd();
    cargarAjaxPersonas();
    cargarAjaxEntidades();
}

function cargarAjaxEntidades() {
    $.ajax({
        type: "GET",
        url: '/api/v1/entities',
        success: function (datos) {
            entidadesId.innerHTML = "";
            datos.entities.forEach((entidad) => {
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

function cargarAjaxPersonas() {
    $.ajax({
        type: "GET",
        url: '/api/v1/persons',
        success: function (data) {
            personasId.innerHTML = "";
            data.persons.forEach((persona) => {
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

function cargarAjaxProd() {
    $.ajax({
        type: "GET",
        url: '/api/v1/products',
        success: function (data) {
            productosId.innerHTML = "";
            data.products.forEach((producto) => {
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

function showDescAjax(prodId, tipo) {
    $.ajax({
        type: "GET",
        url: `/api/v1/${tipo}/${prodId}`,
        success: function (data) {
            let datosAux = "";
            if (tipo === "products")
                datosAux = data.product;
            else if (tipo === "entities")
                datosAux = data.entity;
            else if (tipo === "persons")
                datosAux = data.person;
            descripcion(datosAux);
            modalForm.show();
        }
    });
}

function descripcion(datosAux) {
    let html = `<div class="modal-header">
                   <h3 class="modal-title">Descripcion de ${datosAux.name}</h3>
                   <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form class="modal-body">
                  ${imprimirDesc(datosAux)}
                </form>
                <div id="mFooter2" class="modal-footer">
                   <button type="button" class="btn red" data-bs-dismiss="modal">Cerrar</button>
                </div>`;
    contenidoFormAdd.innerHTML = html;
}

function imprimirDesc(datosAux) {
    let html = '';
    for (let atributo in datosAux) {
        if (atributo === "products" || atributo === "persons" || atributo === "entities") {
            let id = "lista" + atributo;
            html +=`<div class='mb-2'><h4>${atributo}</h4><ul class='datos' id='${id}'>`;
            html += imprimirRelaciones(datosAux[atributo], atributo, id);
            html += "</ul></div>"
        } else if (atributo === "wikiUrl") {
            html += `<div class='mb-2 wiki'><h4>${atributo}</h4><a href='${datosAux[atributo]}' class='datos' target='_blank'>${datosAux[atributo]}</a></div>`;
        } else if (atributo !== "id") {
            html += `<div class='mb-2'><h4>${atributo}</h4><p class='datos'>${datosAux[atributo]}</p></div>`;
        }
    }
    return html;
}

function imprimirRelaciones(arrayRel, atributo, id) {
    let html = "";
    if (arrayRel === null) {
        html += "";
    } else {
        for (let i = 0; i < arrayRel.length; i++) {
            let aux = "";
            if (atributo === "products") {
                aux = arrayProductos.find(producto => producto.id.slice(0, -4) == arrayRel[i]);
            } else if (atributo === "entities") {
                aux = arrayEntidades.find(entidad => entidad.id.slice(0, -4) == arrayRel[i]);
            } else if (atributo === "persons") {
                aux = arrayPersonas.find(persona => persona.id.slice(0, -4) == arrayRel[i]);
            }
            html += `<li>${aux.name+" id: "+arrayRel[i]}</li>`;
        }
    }
    return html;
}

function addClickListener(selector, tipo) {
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
            arrayUsers = data.users;
            let usuarioEncontrado = arrayUsers.find(usuario => usuario.user.username === username);
            usuarioLogueado = usuarioEncontrado.user;
            if (usuarioEncontrado.user.role === "writer") {
                sessionStorage.setItem("logueado", "true");
                sessionStorage.setItem("role", "writer");
                showBtn();
                console.log("Es writer");
                userid = usuarioEncontrado.user.id;
                getEtagUserAjax(authHeader, userid);
                imprimirUsuario(usuarioLogueado);
            } else if (usuarioEncontrado.user.role === "reader") {
                sessionStorage.setItem("logueado", "true");
                sessionStorage.setItem("role", "reader");
                console.log("Es reader");
                showBtn(usuarioEncontrado);
                userid = usuarioEncontrado.user.id;
                getEtagUserAjax(authHeader, userid);
                imprimirUsuario(usuarioLogueado);
            } else {
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
    if (logueado === "true") {
        loginbtn.style.display = "none";
        logoutbtn.style.display = "inline-block";
        signupbtn.style.display = "none";
        gestionarUsers.style.display = "inline-block";
        if (role === "writer") {
            for (let i = 0; i < displaybtn.length; i++) {
                displaybtn[i].style.display = "flex";
            }
            documento.style.setProperty("--displayCrear", "block");
            botonCrear();
            botonBorrar();
            botonEditar();
            botonGestionarUsers();
        }
        logoutbtn.addEventListener("click", logout);
    } else {
        for (let i = 0; i < displaybtn.length; i++) {
            displaybtn[i].style.display = "none";
        }
        loginbtn.style.display = "inline-block";
        logoutbtn.style.display = "none";
        signupbtn.style.display = "inline-block";
        gestionarUsers.style.display = "none";
        documento.style.setProperty("--displayCrear", "none");
    }
}

loginbtn.addEventListener("click", () => {
    let html = `  <div class="modal-header">
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
                        <p id="pError"></p>
                     </form>
                `;
    contenidoLogin.innerHTML = html;
    $("#login").click((e) => {
        e.preventDefault();
        login();
    });
    modalLogin.show();
});

signupbtn.addEventListener("click", () => {
    let html = `<div class="modal-header">
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
                        <p id="pError"></p>
                    </form>`;
    contenidoLogin.innerHTML = html;
    document.querySelectorAll("#signupForm input").forEach(function (input) {
        input.addEventListener("keyup", () => {
            validacionFormulario(document.querySelectorAll("#signupForm input"), document.getElementById("signup"), 3);
        });
    });
    $("#signup").click((e) => {
        e.preventDefault();
        signup();
    });
    modalLogin.show();
});

function validacionFormulario(formulario, boton, numInput) {
    let completado = 0;
    formulario.forEach(function (input) {
        if (input.value.trim() === "") {
            boton.disabled = true;
        } else {
            completado++;
        }
    });
    if (completado === numInput) {
        boton.disabled = false;
    }
}

$(document).ready(function () {
    cargarAjax();
});

function getAllUsersAjax(authHeader){
    $.ajax({
        type: "GET",
        url: "/api/v1/users",
        cache:false,
        headers: {"Authorization": authHeader},
        success: function(data){
            console.log(data.users);
            arrayUsers=data.users;
            showAllUsers(arrayUsers);
        }
    })
}