function cargarForm(objetoF){
    let html = "";
    for (let atributo in objetoF) {
        if (atributo === "name") {
            html += "<div class='mb-2'><label for='name' class='form-label'>Nombre</label>" +
                "<input type='text' class='form-control' value='" + objetoF[atributo] + "' id='name' required></div>";
        } else if (atributo === "birthDate" || atributo === "deathDate") {
            html += "<div class='mb-2'><label for='" + atributo + "' class='form-label'>" + atributo + "</label>" +
                "<input type='date' class='form-control' value='" + objetoF[atributo] + "' id='" + atributo + "'></div>";
        } else if (atributo === "wikiUrl" || atributo === "imageUrl") {
            html += "<div class='mb-2'><label for='" + atributo + "' class='form-label'>" + atributo + "</label>" +
                "<input type='url' class='form-control' value='" + objetoF[atributo] + "' id='" + atributo + "' required></div>";
        }
    }
    return html;
}

function crear(id){
    let objetoCrear, url;
    if (id === "btnProducto") {
        objetoCrear = new Producto("", "", "", "", "", [], []);
        url='/api/v1/products';
    } else if (id === "btnEntidad") {
        objetoCrear = new Entidad("", "", "", "", "", [], []);
        url='/api/v1/entities';
    } else if (id === "btnPersona") {
        objetoCrear = new Persona("", "", "", "", "", [], []);
        url='/api/v1/persons';
    }
    let html =`<div class="modal-header">
                   <h3 class="modal-title">Crear ${objetoCrear.tipo}</h3>
                   <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form class="modal-body">
                  ${cargarForm(objetoCrear)}
                </form>
                <div id="mFooter2" class="modal-footer">
                   <button type="button" class="btn red" data-bs-dismiss="modal">Cancelar</button>
                   <button type="submit" id="crearNuevo" class="btn loginbtn"> Crear nuevo</button>
                </div>`;

    contenidoFormAdd.innerHTML = html;
    modalForm.show();
    document.getElementById("crearNuevo").addEventListener("click", (e)=>{
        e.preventDefault();
        crearAjax(authHeader, url, id);
        modalForm.hide();
    })
}

function botonCrear(){
    botonesCrear.forEach((botonCrear)=>{
        botonCrear.addEventListener("click", (e)=>{
            console.log(e.target.id);
            crear(e.target.id);
        });
    });
}

function crearAjax(authHeader, url, id){
    let name = $("#name").val();
    let birthDate = $("#birthDate").val();
    let deathDate = $("#deathDate").val();
    let imageUrl = $("#imageUrl").val();
    let wikiUrl = $("#wikiUrl").val();

    let data = {
        name: name,
        birthDate: birthDate,
        deathDate: deathDate,
        imageUrl: imageUrl,
        wikiUrl: wikiUrl
    };
    console.log(data);
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        headers: {"Authorization": authHeader},
        success: function (data){
            console.log(data);
            console.log("Se ha creado");
            if (id === "btnProducto") {
                cargarNuevo("products", data.product);
                addClickListener("#productosCol .imagen", "products");
            } else if (id === "btnEntidad") {
                cargarNuevo("entities", data.entity);
                addClickListener("#entidadesCol .imagen", "entities");
            } else if (id === "btnPersona") {
                cargarNuevo("persons", data.person);
                addClickListener("#personasCol .imagen", "persons");
            }
        }
    })
}

function cargarNuevo(tipo, objeto){
    let objetoAux;
    if (tipo === "products") {
        objetoAux= new Producto(objeto.id + "prod", objeto.name, objeto.birthDate, objeto.deathDate,
            objeto.imageUrl, objeto.wikiUrl, objeto.persons, objeto.entities);
        cargarObjetos(productosId, objetoAux);
        arrayProductos.push(objeto);
    } else if (tipo === "entities") {
        objetoAux= new Entidad(objeto.id + "enti", objeto.name, objeto.birthDate, objeto.deathDate,
            objeto.imageUrl, objeto.wikiUrl, objeto.persons, objeto.products);
        cargarObjetos(entidadesId, objetoAux);
        arrayEntidades.push(objetoAux);
    } else if (tipo === "persons") {
        objetoAux= new Persona(objeto.id + "pers", objeto.name, objeto.birthDate, objeto.deathDate,
            objeto.imageUrl, objeto.wikiUrl, objeto.entities, objeto.products);
        cargarObjetos(personasId, objetoAux);
        arrayPersonas.push(objeto)
    }
    showBtn();
}

function borrarAjax(authHeader, url){
    $.ajax({
        type: "DELETE",
        url: url,
        headers:{"Authorization": authHeader},
        success:function (){
            console.log("Se ha borrado de la api");
        }
    })
}

function botonBorrar(){
    document.querySelectorAll(".borrar").forEach((boton)=>{
        boton.addEventListener("click", (e)=>{
            e.preventDefault();
            let id=e.target.parentNode.parentNode.id;
            let idBorrar=id.substring(0, id.length-4);
            let tipoBorrar=id.substring(id.length-4, id.length);

            if (tipoBorrar === "prod") {
                borrarAjax(authHeader, "/api/v1/products/"+idBorrar);
            } else if (tipoBorrar === "enti") {
                borrarAjax(authHeader, "/api/v1/entities/"+idBorrar);
            } else if (tipoBorrar === "pers") {
                borrarAjax(authHeader, "/api/v1/persons/"+idBorrar);
            }
            let elem=document.getElementById(id);
            elem.parentNode.removeChild(elem);
        });
    });
}
function borrarDeArray(array, id){
    return array.filter(function(object){
        return object.id != id;
    })
}
function botonEditar(){
    document.querySelectorAll(".editar").forEach((boton)=>{
        boton.addEventListener("click", (e)=>{
            e.preventDefault();
            let id=e.target.parentNode.parentNode.id;
            let idEditar=id.substring(0, id.length-4);
            let tipoEditar=id.substring(id.length-4, id.length);

            if (tipoEditar === "prod") {
                showEditarAjax(authHeader, idEditar, "products");
            } else if (tipoEditar === "enti") {
                showEditarAjax(authHeader, idEditar, "entities");
            } else if (tipoEditar === "pers") {
                showEditarAjax(authHeader, idEditar, "persons");
            }
        });
    });
}

function guardarEditarAjax(authHeader, editarId, tipo, etag){
    let name = $("#name").val();
    let birthDate = $("#birthDate").val();
    let deathDate = $("#deathDate").val();
    let imageUrl = $("#imageUrl").val();
    let wikiUrl = $("#wikiUrl").val();
    let data = {
        name: name,
        birthDate: birthDate,
        deathDate: deathDate,
        imageUrl: imageUrl,
        wikiUrl: wikiUrl,
        etag: etag
    };

   $.ajax({
        type: "PUT",
        url: `/api/v1/${tipo}/${editarId}`,
        headers: {"Authorization": authHeader, "If-Match": etag},
        data: data,
        success: function (data) {
            let dataAux;
            console.log("Se ha editado");
            if (tipo === "persons") {
                dataAux=data.person;
                console.log(dataAux);
                let id=dataAux.id + "pers";
                let elem=document.getElementById(id);
                elem.parentNode.removeChild(elem);
                cargarObjetos(personasId, {id: id, name:dataAux.name, imageUrl:dataAux.imageUrl});
                showBtn();
                addClickListener("#personasCol .imagen", "persons");
            } else if (tipo === "entities") {
            } else if (tipo === "products") {
            }
            modalForm.hide();
        }
    })
}

function editar(objetoEditar, editar, etag){
    let html =`<div class="modal-header">
                   <h3 class="modal-title">Editar</h3>
                   <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form class="modal-body">
                  ${cargarForm(objetoEditar)}
                </form>
                <div id="mFooter2" class="modal-footer">
                   <button type="button" class="btn red" data-bs-dismiss="modal">Cancelar</button>
                   <button type="submit" id="guardarCambios" class="btn loginbtn"> Guardar cambios</button>
                </div>`;
    contenidoFormAdd.innerHTML=html;
    document.getElementById("guardarCambios").addEventListener("click", (e)=>{
        e.preventDefault();
        guardarEditarAjax(authHeader, objetoEditar.id, editar, etag);
    })
}

function showEditarAjax(authHeader, prodId, tipo){
    $.ajax({
        type: "GET",
        url: `/api/v1/${tipo}/${prodId}`,
        headers: {"Authorization": authHeader},
        success: function (data, textStatus, request) {
            console.log(data);
            console.log(request.getResponseHeader("etag"));
            let etag = request.getResponseHeader("etag");
            let datosAux = "";
            if(tipo === "products")
                datosAux = data.product;
            else if(tipo === "entities")
                datosAux = data.entity;
            else if(tipo === "persons")
                datosAux = data.person;
            editar(datosAux, tipo, etag);
            modalForm.show();
        }
    });
}

