function actualizarUserAjax(authHeader){
    let user = $("#usuarioE").val();
    let pwd = $("#pwdE").val();
    let email = $("#emailE").val();
    let fechanac = $("#fechanacE").val();
    let dataString = {username: user, email: email, password:pwd, role: usuarioLogueado.role, fechanac:fechanac, activo:"activo"};

    $.ajax({
        type: "PUT",
        url: "/api/v1/users/"+userid,
        data: dataString,
        headers: {"Authorization": authHeader, "If-Match": usuarioEtag},
        cache: false,
        success: function (data){
            console.log(data);
            modalLogin.hide();
        }
    });
}

function getEtagUserAjax(authHeader, userid){
    $.ajax({
        type: "GET",
        url: `/api/v1/users/${userid}`,
        headers: {"Authorization": authHeader},
        cache: false,
        success: function (data, textStatus, request){
            console.log(data);
            usuarioEtag = request.getResponseHeader("etag");
            console.log(usuarioEtag);
        }
    });
}

function botonEditarUser(){
    editarbtn.addEventListener("click", ()=>{
        let html=`<div class="modal-header">
                        <h3 class="modal-title">Editar perfil</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="editForm" class="modal-body">
                        <div class="mb-2">
                            <label for="emailE" class="form-label">Email</label>
                            <input type="text" class="form-control" value="${usuarioLogueado.email}" id="emailE">
                        </div>
                        <div class="mb-2">
                            <label for="usuarioE" class="form-label">Usuario</label>
                            <input type="text" class="form-control" value="${usuarioLogueado.username}" id="usuarioE">
                        </div>
                        <div class="mb-2">
                            <label for="pwdE" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" value="" id="pwdE">
                        </div>
                        <div class="mb-2">
                            <label for="fechanacE" class="form-label">Fecha Nacimiento</label>
                            <input type="text" class="form-control" value="${usuarioLogueado.fechanac}" id="fechanacE">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn red" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" id="editarPerfil" class="btn loginbtn">Guardar cambios</button>
                        </div>
                    </form>`;
        contenidoLogin.innerHTML=html;
        $('#editForm')[0].reset();
        imprimirUsuario(usuarioLogueado);
        document.getElementById("editarPerfil").disabled=true;
        document.querySelectorAll("#editForm input").forEach(function (input) {
            input.addEventListener("keyup", () => {
                validacionFormulario(document.querySelectorAll("#editForm input"), document.getElementById("editarPerfil"), 4);
            });
        });
        $("#editarPerfil").click((e)=>{
            e.preventDefault();
            actualizarUserAjax();
        });
        modalLogin.show();
    });
}

function botonGestionarUsers(){
    $(document).off('click', '#gestionarUsers');
    $(document).on('click', '#gestionarUsers', function () {
        getAllUsersAjax(authHeader);
    });
}

function showAllUsers(userArray){
    let html=`<div class="modal-header">
                        <h3 class="modal-title">Gestión usuarios</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                <div id="containerAllUsers" class="modal-body">`;
    for(let i=0; i<userArray.length; i++){
        let auxObject = userArray[i].user;
        let htmlAux="";
        let idAux;
        for(atributo in auxObject){
            htmlAux+=`<p><strong>${atributo}: </strong>${auxObject[atributo]}</p>`;
            if(atributo === "id"){
                idAux=auxObject[atributo] + "user";
            }
        }
        html+=`<div id='${idAux}' class="row usuarioContainer"><div class="col-6">${htmlAux}</div>`;
        html+=`<div class='col-6 btnGestionarUsersContainer'>
                 <button id='${idAux+'rol'}' type="button" class="btn loginbtn" onclick="updateRol(this.id)">Cambiar rol</button>
                 <button id='${idAux+'act'}' type="button" class="btn loginbtn" onclick="updateActivo(this.id)">Des/Activar</button>
                 <button id='${idAux+'del'}' type="button" class="btn red" onclick="deleteUser(this.id)">Eliminar</button>
            </div></div>`;
    }
    html+="</div>";
    contenidoLogin.innerHTML=html;
    modalLogin.show();
}

function deleteUser(btnId){
    let id = btnId.slice(0, -7);
    console.log(id);
    deleteUserAjax(authHeader,id);
}

function deleteUserAjax(authHeader,id){
    $.ajax({
        type: "DELETE",
        url: `/api/v1/users/${id}`,
        headers: {"Authorization": authHeader},
        success: function(){
            console.log("Se ha borrado");
        }
    })
}

function updateRol(btnId){
    let id = btnId.slice(0, -7);
    let usuarioEncontrado = arrayUsers.find(usuario => usuario.user.id == id); //compara int con string
    console.log(usuarioEncontrado);
    let rol;
    if(usuarioEncontrado.user.role === "writer"){
        rol="reader";
        updateRolAjax(authHeader, usuarioEncontrado.user, rol);
    } else if(usuarioEncontrado.user.role === "reader"){
        rol="writer";
        updateRolAjax(authHeader, usuarioEncontrado.user, rol);
    }
}

function updateRolAjax(authHeader, usuario, rol){
    $.ajax({
        type: "GET",
        url: `/api/v1/users/${usuario.id}`,
        headers: {"Authorization": authHeader},
        cache: false,
        success: function (data, textStatus, request){
            console.log(data);
            putRolAjax(authHeader, usuario, rol, request.getResponseHeader("etag")) ;
            console.log(request.getResponseHeader("etag"));
        }
    });
}

function putRolAjax(authHeader, usuario, rol, etag){
    let datos = {role: rol};
    console.log(datos);
    $.ajax({
        type: "PUT",
        url: `/api/v1/users/${usuario.id}`,
        data: datos,
        headers: {"Authorization": authHeader, "If-Match": etag},
        cache: false,
        success: function (data){
            console.log(data);
            console.log("Se ha actualizado rol");
            modalLogin.hide();
        }
    });
}

function updateActivo(btnId){
    let id = btnId.slice(0, -7);
    let usuarioEncontrado = arrayUsers.find(usuario => usuario.user.id == id); //compara int con string
    console.log(usuarioEncontrado);
    let isActivo;
    if(usuarioEncontrado.user.activo === "activo"){
        isActivo="inactivo";
        updateActivoAjax(authHeader, usuarioEncontrado.user, isActivo);
    } else if(usuarioEncontrado.user.activo === "inactivo"){
        isActivo="activo";
        updateActivoAjax(authHeader, usuarioEncontrado.user, isActivo);
    }
}

function updateActivoAjax(authHeader, usuario, activo){
    $.ajax({
        type: "GET",
        url: `/api/v1/users/${usuario.id}`,
        headers: {"Authorization": authHeader},
        cache: false,
        success: function (data, textStatus, request){
            console.log(data);
            console.log(activo);
            putActivoAjax(authHeader, usuario, activo, request.getResponseHeader("etag")) ;
            console.log(request.getResponseHeader("etag"));
        }
    });
}

function putActivoAjax(authHeader, usuario, activo, etag){
    let datos = {activo:activo};
    console.log(datos);
    $.ajax({
        type: "PUT",
        url: `/api/v1/users/${usuario.id}`,
        data: datos,
        headers: {"Authorization": authHeader, "If-Match": etag},
        cache: false,
        success: function (data){
            console.log(data);
            console.log("Se ha actualizado activo");
            modalLogin.hide();
        }
    });
}

function signup() {
    let user = $("#usuario").val();
    let pwd = $("#pwd").val();
    let email = $("#email").val();

    $.ajax({
        type: "POST",
        url: "/api/v1/users",
        data: {username: user, email: email, password: pwd, role: "reader", fechanac: "", activo: "activo"},
        cache: false,
        success: function (data, textStatus, request) {
            console.log(data);
            console.log(textStatus+" "+request);
            login();
            modalLogin.hide();
        },
        statusCode: {
            400: function () {
                document.getElementById("pError").innerText = "Ya existe este usuario o email";
            }
        }
    });
};

function login() {
    let user = $("#usuario").val();
    let pwd = $("#pwd").val();
    let dataString = "username=" + user + "&password=" + pwd;
    $.ajax({
        type: "POST",
        url: "/access_token",
        data: dataString,
        cache: false,
        success: function (data, textStatus, request) {
            authHeader = request.getResponseHeader('Authorization');
            console.log(authHeader);
            rolUser(authHeader, user);
            modalLogin.hide();
        },
        statusCode: {
            404: function () {
                console.log("usuario inactivo");
                window.alert("Este usuario está inactivo");
            }
        }
    });
}

function imprimirUsuario(user){
    let html = "";
    for(atributo in user){
        html+=`<p><strong>${atributo}: </strong>${user[atributo]}</p>`;
    }
    userDiv.innerHTML=html;
    userDiv.innerHTML+=`<button type="button" id="editUser" class="btn loginbtn align-items-center">
                <img src="iconos/editar.png" class="me-2"><span>Editar Usuario</span></button>
            <div>`;
    editarbtn=document.getElementById("editUser");
    botonEditarUser();
}

function logout() {
    sessionStorage.setItem("logueado", "false");
    showBtn();
    userDiv.innerHTML="";
    authHeader=null;
}

function showToken(authHeader) {
    let token = authHeader.split(' ')[1];   // Elimina 'Bearer '
    let myData = JSON.parse(atob(token.split('.')[1]));
    $('#mytoken').html(
        "User: " + JSON.stringify(myData.sub) +
        " - JWT Scopes: " + JSON.stringify(myData.scopes)
    );
}