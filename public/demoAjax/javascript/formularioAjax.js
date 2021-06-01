function cargarForm(objetoF) {
    let html = "";
    for (let atributo in objetoF) {
        if (atributo === "name") {
            html += "<div class='mb-2'><label for='name' class='form-label'>Name</label>" +
                "<input type='text' class='form-control' value='" + objetoF[atributo] + "' id='name' required></div>";
        } else if (atributo === "birthDate" || atributo === "deathDate") {
            html += "<div class='mb-2'><label for='" + atributo + "' class='form-label'>" + atributo + "</label>" +
                "<input type='date' class='form-control' value='" + objetoF[atributo] + "' id='" + atributo + "'></div>";
        } else if (atributo === "wikiUrl" || atributo === "imageUrl") {
            html += "<div class='mb-2'><label for='" + atributo + "' class='form-label'>" + atributo + "</label>" +
                "<input type='url' class='form-control' value='" + objetoF[atributo] + "' id='" + atributo + "' required></div>";
        } else if (atributo === "products") {
            html += `<div class='mb-2'><h4>${atributo}</h4><ul class='datos' id='${"lista" + atributo}'>`;
            html += imprimirRelaciones(objetoF.products, atributo, "lista" + atributo);
            html += "</ul></div>";
            html += `<div id="relproducts">
                        <select id="selectProducts" class="form-select">
                          ${imprimirOpcionesSelect(arrayProductos)}
                        </select>
                        <button type="button" class="btn borrarRel">Borrar relación</button>
                        <button type="button" class="btn btnRel">Añadir relación</button>
                    </div>`;
        } else if (atributo === "entities") {
            html += `<div class='mb-2'><h4>${atributo}</h4><ul class='datos' id='${"lista" + atributo}'>`;
            html += imprimirRelaciones(objetoF.entities, atributo, "lista" + atributo);
            html += "</ul></div>";
            html += `<div id="relentities">
                        <select id="selectEntities" class="form-select">
                          ${imprimirOpcionesSelect(arrayEntidades)}
                        </select>
                        <button type="button" class="btn borrarRel">Borrar relación</button>
                        <button type="button" class="btn btnRel">Añadir relación</button>
                    </div>`;
        } else if (atributo === "persons") {
            html += `<div class='mb-2'><h4>${atributo}</h4><ul class='datos' id='${"lista" + atributo}'>`;
            html += imprimirRelaciones(objetoF.persons, atributo, "lista" + atributo);
            html += "</ul></div>";
            html += `<div id="relpersons">
                        <select id="selectPersons" class="form-select">
                          ${imprimirOpcionesSelect(arrayPersonas)}
                        </select>
                        <button type="button" class="btn borrarRel">Borrar relación</button>
                        <button type="button" class="btn btnRel" >Añadir relación</button>
                    </div>`;
        }
    }
    return html;
}

function botonDeleteRel(objetoEditar, tipoOrigen) {
    let oldRel;
    document.querySelectorAll(".borrarRel").forEach((boton) => {
        boton.addEventListener("click", (event) => {
            let id = event.target.parentNode.id;
            let tipoDes = id.slice(3, id.length);
            console.log("intento Borrar");
            if (tipoDes === "products") {
                oldRel = document.getElementById("selectProducts").value;
                deleteRelAjax(authHeader, tipoOrigen, tipoDes, objetoEditar.id, oldRel);
            } else if (tipoDes === "entities") {
                oldRel = document.getElementById("selectEntities").value;
                deleteRelAjax(authHeader, tipoOrigen, tipoDes, objetoEditar.id, oldRel);
            } else if (tipoDes === "persons") {
                oldRel = document.getElementById("selectPersons").value;
                deleteRelAjax(authHeader, tipoOrigen, tipoDes, objetoEditar.id, oldRel);
            }
        })
    });
}

function deleteRelAjax(authHeader, origen, destino, idOrigen, idDestino) {
    $.ajax({
        type: "PUT",
        url: `/api/v1/${origen}/${idOrigen}/${destino}/rem/${idDestino}`,
        headers: {"Authorization": authHeader},
        success: function (data) {
            console.log("borrada rel");
            console.log(data);
            if (origen === "products") {
                actualizarRelaciones(data.product);
            } else if (origen === "entities") {
                actualizarRelaciones(data.entity);
            } else if (origen === "persons") {
                actualizarRelaciones(data.person);
            }
        }
    });
}

function actualizarRelaciones(objeto) {
    console.log("intento actualizar lista")
    for (atributo in objeto) {
        if (atributo === "products" || atributo === "entities" || atributo === "persons") {
            if (objeto[atributo] !== null) {
                console.log(objeto[atributo]);
                document.getElementById("lista" + atributo).innerHTML = imprimirRelaciones(objeto[atributo], atributo, "lista" + atributo);
            } else
                document.getElementById("lista" + atributo).innerHTML = imprimirRelaciones([], atributo, "lista" + atributo);
        }
    }
}

function botonAddRel(objetoEditar, tipo) {
    let newRel;
    console.log(document.querySelectorAll(".btnRel"));
    document.querySelectorAll(".btnRel").forEach((boton) => {
        boton.addEventListener("click", (event) => {
            let id = event.target.parentNode.id;
            let tipoDes = id.slice(3, id.length);
            if (tipoDes === "products") {
                newRel = document.querySelector("#relproducts>select").value;
                addRelAjax(authHeader, tipo, tipoDes, objetoEditar.id, newRel);
            } else if (tipoDes === "entities") {
                newRel = document.querySelector("#relentities>select").value;
                addRelAjax(authHeader, tipo, tipoDes, objetoEditar.id, newRel);
            } else if (tipoDes === "persons") {
                newRel = document.querySelector("#relpersons>select").value;
                addRelAjax(authHeader, tipo, tipoDes, objetoEditar.id, newRel);
            }
        })
    });
}

function addRelAjax(authHeader, origen, destino, idOrigen, idDestino) {
    $.ajax({
        type: "PUT",
        url: `/api/v1/${origen}/${idOrigen}/${destino}/add/${idDestino}`,
        headers: {"Authorization": authHeader},
        success: function (data) {
            console.log(data);
            if (origen === "products") {
                actualizarRelaciones(data.product);
            } else if (origen === "entities") {
                actualizarRelaciones(data.entity);
            } else if (origen === "persons") {
                actualizarRelaciones(data.person);
            }
            console.log("New rel added");
        }
    });
}

function imprimirOpcionesSelect(array) {
    let html = "";
    array.forEach((objeto) => {
        html += `<option value='${objeto.id.slice(0, -4)}'>${objeto.name + " id: " + objeto.id.slice(0, -4)}</option>`
    });
    return html;
}

function crear(id) {
    let objetoCrear, url;
    if (id === "btnProducto") {
        objetoCrear = new Producto("", "", "", "", "", "", [], []);
        url = '/api/v1/products';
    } else if (id === "btnEntidad") {
        objetoCrear = new Entidad("", "", "", "", "", "", [], []);
        url = '/api/v1/entities';
    } else if (id === "btnPersona") {
        objetoCrear = new Persona("", "", "", "", "", "", [], []);
        url = '/api/v1/persons';
    }
    let html = `<div class="modal-header">
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
    document.getElementById("crearNuevo").addEventListener("click", (e) => {
        e.preventDefault();
        crearAjax(authHeader, url, id);
        modalForm.hide();
    });
    document.querySelectorAll(".btnRel").forEach((boton) => {
        boton.disabled = true;
    });
    document.querySelectorAll(".borrarRel").forEach((boton) => {
        boton.disabled = true;
    });
    document.querySelectorAll("select").forEach((select) => {
        select.style.display = "none";
    });
}

function botonCrear() {
    $(document).off('click', '.crear');
    $(document).on('click', '.crear', function (e) {
        console.log(e.target.id);
        crear(e.target.id);
    });
}

function crearAjax(authHeader, url, id) {
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
        success: function (data) {
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

function cargarNuevo(tipo, objeto) {
    let objetoAux;
    console.log(objeto);
    if (tipo === "products") {
        objetoAux = new Producto(objeto.id + "prod", objeto.name, objeto.birthDate, objeto.deathDate,
            objeto.imageUrl, objeto.wikiUrl, objeto.persons, objeto.entities);
        cargarObjetos(productosId, objetoAux);
        arrayProductos.push(objetoAux);
    } else if (tipo === "entities") {
        objetoAux = new Entidad(objeto.id + "enti", objeto.name, objeto.birthDate, objeto.deathDate,
            objeto.imageUrl, objeto.wikiUrl, objeto.persons, objeto.products);
        cargarObjetos(entidadesId, objetoAux);
        arrayEntidades.push(objetoAux);
    } else if (tipo === "persons") {
        objetoAux = new Persona(objeto.id + "pers", objeto.name, objeto.birthDate, objeto.deathDate,
            objeto.imageUrl, objeto.wikiUrl, objeto.entities, objeto.products);
        cargarObjetos(personasId, objetoAux);
        arrayPersonas.push(objetoAux)
    }
    showBtn();
}

function borrarAjax(authHeader, url) {
    $.ajax({
        type: "DELETE",
        url: url,
        headers: {"Authorization": authHeader},
        success: function () {
            console.log("Se ha borrado de la api");
        }
    })
}

function botonBorrar() {
    $(document).off('click', '.borrar');
    $(document).on('click', '.borrar', function (e) {
        e.preventDefault();
        let id = e.target.parentNode.parentNode.id;
        let idBorrar = id.substring(0, id.length - 4);
        let tipoBorrar = id.substring(id.length - 4, id.length);

        if (tipoBorrar === "prod") {
            borrarAjax(authHeader, "/api/v1/products/" + idBorrar);
            indexBorrarArray(arrayProductos, id);
        } else if (tipoBorrar === "enti") {
            borrarAjax(authHeader, "/api/v1/entities/" + idBorrar);
            indexBorrarArray(arrayEntidades, id);
        } else if (tipoBorrar === "pers") {
            borrarAjax(authHeader, "/api/v1/persons/" + idBorrar);
            indexBorrarArray(arrayPersonas, id);
        }
        let elem = document.getElementById(id);
        elem.parentNode.removeChild(elem);
    });
}


function indexBorrarArray(array, idBorrar) {
    let index = array.findIndex(objeto => objeto.id === idBorrar);
    array.splice(index, 1);
    console.log(array);
}

function botonEditar() {
    $(document).off('click', '.editar');
    $(document).on('click', '.editar', function (e) {
        e.preventDefault();
        let id = e.target.parentNode.parentNode.id;
        let idEditar = id.substring(0, id.length - 4);
        let tipoEditar = id.substring(id.length - 4, id.length);

        if (tipoEditar === "prod") {
            showEditarAjax(authHeader, idEditar, "products");
        } else if (tipoEditar === "enti") {
            showEditarAjax(authHeader, idEditar, "entities");
        } else if (tipoEditar === "pers") {
            showEditarAjax(authHeader, idEditar, "persons");
        }
    });
}

function guardarEditarAjax(authHeader, editarId, tipo, etag) {
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
                dataAux = data.person;
                console.log(dataAux);
                let id = dataAux.id + "pers";
                let elem = document.getElementById(id);
                elem.parentNode.removeChild(elem);
                cargarObjetos(personasId, {id: id, name: dataAux.name, imageUrl: dataAux.imageUrl});
                showBtn();
                addClickListener("#personasCol .imagen", "persons");
            } else if (tipo === "entities") {
                dataAux = data.entity;
                console.log(dataAux);
                let id = dataAux.id + "enti";
                let elem = document.getElementById(id);
                elem.parentNode.removeChild(elem);
                cargarObjetos(entidadesId, {id: id, name: dataAux.name, imageUrl: dataAux.imageUrl});
                showBtn();
                addClickListener("#entidadesCol .imagen", "entities");
            } else if (tipo === "products") {
                dataAux = data.product;
                console.log(dataAux);
                let id = dataAux.id + "prod";
                let elem = document.getElementById(id);
                elem.parentNode.removeChild(elem);
                cargarObjetos(productosId, {id: id, name: dataAux.name, imageUrl: dataAux.imageUrl});
                showBtn();
                addClickListener("#productosCol .imagen", "products");
            }
            modalForm.hide();
        }
    })
}

function editar(objetoEditar, tipo, etag) {
    console.log(objetoEditar);
    let html = `<div class="modal-header">
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
    contenidoFormAdd.innerHTML = html;
    document.getElementById("guardarCambios").addEventListener("click", (e) => {
        e.preventDefault();
        guardarEditarAjax(authHeader, objetoEditar.id, tipo, etag);
    });
}

function showEditarAjax(authHeader, prodId, tipo) {
    $.ajax({
        type: "GET",
        url: `/api/v1/${tipo}/${prodId}`,
        headers: {"Authorization": authHeader},
        success: function (data, textStatus, request) {
            console.log(data);
            console.log(request.getResponseHeader("etag"));
            let etag = request.getResponseHeader("etag");
            let datosAux = "";
            if (tipo === "products")
                datosAux = data.product;
            else if (tipo === "entities")
                datosAux = data.entity;
            else if (tipo === "persons")
                datosAux = data.person;
            editar(datosAux, tipo, etag);
            botonAddRel(datosAux, tipo);
            botonDeleteRel(datosAux, tipo);
            modalForm.show();
        }
    });
}

