const documento = document.documentElement;
const loginbtn = document.getElementById("loginNav");
const logoutbtn = document.getElementById("logout");

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

