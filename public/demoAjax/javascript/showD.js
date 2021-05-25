function showD(elem) {
    elemId = elem.parentNode.id;
    let objetoShow = localizarElem(elemId);
    formulario.innerHTML = "";

    for (let atributo in objetoShow) {
        if (atributo == "personas" || atributo == "entidades") {
            let id = "lista" + atributo;
            formulario.innerHTML += "<div class='mb-2'><h4>" + atributo + "</h4><ul class='datos' id='" + id + "'></ul></div>";
            for (let i = 0; i < objetoShow[atributo].length; i++) {
                let elemAux = localArray.find(objeto => objeto.id == objetoShow[atributo][i]);
                let texto = elemAux.nombre;
                document.getElementById(id).innerHTML += "<li>" + texto + "</li>";
            }
        } else if (atributo == "wiki") {
            formulario.innerHTML += "<div class='mb-2 wiki'><h4>" + atributo + "</h4><a href='" + objetoShow[atributo] + "' class='datos' target='_blanck'>" + objetoShow[atributo] + "</a></div>";
        } else if (atributo != "id" && atributo != "tipo") {
            formulario.innerHTML += "<div class='mb-2'><h4>" + atributo + "</h4><p class='datos'>" + objetoShow[atributo] + "</p></div>";
        }
    }

    tituloForm.innerHTML = objetoShow["nombre"];
    document.getElementById("mFooter2").style.display = "none";
}

document.querySelectorAll(".imagen").forEach(item => {
    item.addEventListener("click", function () {
        showD(this);
    })
    item.addEventListener("error", function () {
        item.src = "/iconos/not-found-image.jpg";
    })
});