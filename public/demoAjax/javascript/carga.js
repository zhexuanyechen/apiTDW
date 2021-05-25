function Persona(id, nombre, fecha_nac, fecha_muerto, img, wiki) {
    this.id = id;
    this.nombre = nombre;
    this.fecha_nac = fecha_nac;
    this.fecha_def = fecha_muerto;
    this.imagen = img;
    this.wiki = wiki;
    this.tipo = "personas";
}

function Entidad(id, nombre, fecha_inic, fecha_fin, img, wiki, personas) {
    this.id = id;
    this.nombre = nombre;
    this.fecha_nac = fecha_inic;
    this.fecha_def = fecha_fin;
    this.imagen = img;
    this.wiki = wiki;
    this.tipo = "entidades";
    this.personas = personas;
}

function Producto(id, nombre, fecha_inic, fecha_fin, img, wiki, personas, entidades) {
    this.id = id;
    this.nombre = nombre;
    this.fecha_nac = fecha_inic;
    this.fecha_def = fecha_fin;
    this.imagen = img;
    this.wiki = wiki;
    this.tipo = "producto";
    this.personas = personas;
    this.entidades = entidades;
}

function cargarObjetos(id, objeto) {
    let htmlId = id;
    htmlId.innerHTML += "<div id='" + objeto.id + "' class='card mb-3'><img src='" + objeto.imagen + "' class='card-img-top imagen' data-bs-toggle='modal' data-bs-target='#modalFormulario'>" +
        "<div class='card-body'><h5 class='card-title text-center'>" + objeto.nombre + "</h5></div>" +
        "<div class='mb-2 botonesObjeto'><button type='button' class='btn red borrar'>Borrar</button>" +
        "<button type='button' class='btn editar' data-bs-toggle='modal' data-bs-target='#modalFormulario'>Editar</button></div></div>";
}

function cargarDatosLocal() {
    let tim = new Persona("tim", "Tim Berners-Lee", "1955-06-08", "", "https://www.digitalbizmagazine.com/wp-content/uploads/2017/03/tim-berners-lee-1068x712.jpg", "https://es.wikipedia.org/wiki/Tim_Berners-Lee");
    let brendan = new Persona("brendan", "Brendan Eich", "1961-07-04", "", "https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/wp-cms/uploads/2019/04/p-2-qandampa-with-javascript-creator-and-brave-ceo-brendan-eich.jpg", "https://en.wikipedia.org/wiki/Brendan_Eich");
    let vannevar = new Persona("vannevar", "Vannevar Bush", "1890-03-11", "1974-06-28", "http://4.bp.blogspot.com/-ITqAk_Bdac4/UQ2bFEBYuaI/AAAAAAAAAOo/aMA4UN49r_w/s1600/Vannevar-Bush.jpg", "https://es.wikipedia.org/wiki/Vannevar_Bush");
    let bill = new Persona("bill", "Bill Gates", "1955-10-28", "", "https://www.mundodeportivo.com/r/GODO/MD/p8/MasQueDeporte/Imagenes/2021/03/03/Recortada/img_ocharaf-eddine_20201204-175459_imagenes_md_otras_fuentes_bill_gates-kgdH-U492431066582fo-980x554@MundoDeportivo-Web.jpg", "https://es.wikipedia.org/wiki/Bill_Gates");

    let ibm = new Entidad("ibm", "IBM", "1911-06-06", "", "https://geekzilla.tech/home/wp-content/uploads/2020/10/ibm_cv-1-710x375-1.jpg", "https://es.wikipedia.org/wiki/IBM", [])
    let w3c = new Entidad("w3c", "World Wide Web Consortium", "1994-10-01", "", "https://img.flaticon.com/icons/png/512/1458/1458746.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF", "https://es.wikipedia.org/wiki/World_Wide_Web_Consortium", ["tim"]);
    let microsoft = new Entidad("microsoft", "Microsoft", "1975-03-04", "", "https://png.pngtree.com/element_our/md/20180627/md_5b334611860fa.jpg", "https://es.wikipedia.org/wiki/Microsoft", ["bill"]);
    let mozilla = new Entidad("mozilla", "Fundacion Mozilla", "2003-07-15", "", "https://www.silicon.es/wp-content/uploads/2015/11/mozilla-foundation-logo.jpg", "https://es.wikipedia.org/wiki/Fundaci%C3%B3n_Mozilla", ["brendan"]);

    let xhtml = new Producto("xhtml", "eXtensible HyperText Markup Language", "2000-01-26", "", "https://image.flaticon.com/icons/png/512/28/28780.png", "https://es.wikipedia.org/wiki/XHTML", [], ["w3c"]);
    let xml = new Producto("xml", "eXtensible Markup Language", "1998-02-10", "", "https://png.pngtree.com/element_our/png_detail/20181227/xml-vector-icon-png_287418.jpg", "https://en.wikipedia.org/wiki/XML#Versions", [], ["w3c"]);
    let html = new Producto("html", "HyperText Markup Language", "1993-01-01", "", "https://www.loopeando.com/wp-content/uploads/2016/11/html5.jpg", "https://es.wikipedia.org/wiki/HTML", [], ["w3c"]);
    let js = new Producto("js", "JavaScript", "1995-01-01", "", "https://oddbytes.net/wp-content/uploads/2018/01/Js-logo.png", "https://es.wikipedia.org/wiki/JavaScript", ["brendan"], ["mozilla"]);
    let css = new Producto("css", "Cascading Style Sheets", "1996-12-17", "", "https://extassisnetwork.com/tutoriales/wp-content/uploads/Que-es-CSS.jpg", "https://es.wikipedia.org/wiki/Hoja_de_estilos_en_cascada", [], ["w3c"]);
    let http = new Producto("http", "Protocolo de transferencia de hipertexto", "1991-01-01", "", "https://blog.gosocket.net/wp-content/uploads/2016/09/http.jpg", "https://es.wikipedia.org/wiki/Protocolo_de_transferencia_de_hipertexto", [], ["w3c"]);

    let cargaArray = [tim, brendan, vannevar, bill, xhtml, xml, html, js, css, http, ibm, w3c, microsoft, mozilla];
    localStorage.setItem("cargaArray", JSON.stringify(cargaArray));
}

function cargarIndex() {
    let productosId = document.getElementById("productosCol");
    let entidadesId = document.getElementById("entidadesCol");
    let personasId = document.getElementById("personasCol");
    let array = JSON.parse(localStorage.getItem("cargaArray"));

    for (let i = 0; i < array.length; i++) {
        if (array[i].tipo == "personas") {
            cargarObjetos(personasId, array[i]);
        } else if (array[i].tipo == "producto") {
            cargarObjetos(productosId, array[i]);
        } else if (array[i].tipo == "entidades") {
            cargarObjetos(entidadesId, array[i]);
        }
    }
}

function cargarPagina() {
    if (localStorage.getItem("cargado") === null) {
        cargarDatosLocal();
        cargarIndex();
        localStorage.setItem("cargado", true);
    } else {
        cargarIndex();
    }
};

cargarDatosLocal(); //Descomentar por si se quiere volver a los valores preterminados
cargarPagina();

function borrar(elem) {
    let elemId = elem.parentNode.parentNode.id;
    let borrarElem = localArray.map(function (item) {
        return item.id;
    }).indexOf(elemId);

    document.getElementById(elemId).style.display = "none";
    localArray.splice(borrarElem, 1);
    console.log(localArray);
    localStorage.setItem("cargaArray", JSON.stringify(localArray));
}

document.querySelectorAll(".borrar").forEach(item => {
    item.addEventListener("click", function () {
        borrar(this);
    })
});

document.querySelectorAll(".editar").forEach(item => {
    item.addEventListener("click", function () {
        editar(this);
    })
});