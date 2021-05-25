const documento = document.documentElement;
const loginbtn = document.getElementById("loginNav");
const logoutbtn = document.getElementById("logout");

function Escritor(user, pwd) {
    this.user = user;
    this.pwd = pwd;
}

function cargarUsers() {
    if (localStorage.getItem("usuarios") === null) {
        let x = new Escritor("x", "x");
        let y = new Escritor("y", "y");
        let z = new Escritor("z", "z");
        let usuarios = [x, y, z];
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

function login() {
    let user = document.getElementById("usuario").value;
    let password = document.getElementById("pwd").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].user == user && usuarios[i].pwd == password) {
            sessionStorage.setItem("logueado", "true");
        }
    }
}
document.getElementById("login").addEventListener("click", () => {
    login();
    showBtn();
});

function logout() {
    sessionStorage.setItem("logueado", "false");
}
document.getElementById("logout").addEventListener("click", () => {
    logout();
    showBtn();
});

function showBtn() {
    let displaybtn = document.getElementsByClassName("botonesObjeto");
    if (sessionStorage.getItem("logueado") == "true") {
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

cargarUsers();
showBtn();