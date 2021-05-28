function actualizarUser(authHeader){
    let user = $("#usuarioE").val();
    let pwd = $("#pwdE").val();
    let email = $("#emailE").val();
    let fechanac = $("#fechanacE").val();
    let dataString = JSON.stringify({username: user, email: email, password:pwd, role: usuarioLogueado.role, activo:"activo", fechanac:fechanac});

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

function getEtagUser(authHeader){
    $.ajax({
        type: "Get",
        url: "/api/v1/users/"+userid,
        headers: {"Authorization": authHeader},
        cache: false,
        success: function (data, textStatus, request){
            console.log(data);
            usuarioEtag=request.getResponseHeader("etag");
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
                    <form id="signupForm" class="modal-body">
                        <div class="mb-2">
                            <img class="loginImg" src="iconos/user.png" class="me-2">
                        </div>
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
                            <button type="submit" id="editarPerfil" class="btn loginbtn"><img
                                    src="iconos/user.png" class="me-2">Editar Perfil</button>
                        </div>
                    </form>`;
        contenidoLogin.innerHTML=html;
        $('#signupForm')[0].reset();
        $("#editarPerfil").click((e)=>{
            e.preventDefault();
            actualizarUser();
        });
        modalLogin.show();
    });
}