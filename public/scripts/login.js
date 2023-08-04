let login = document.getElementById("login_form__button")
let github_login = document.getElementById("login_github_button")

async function login_solititude(){

    let usuario = JSON.stringify({
        mail: document.getElementById("login_form__mail").value,
        password: document.getElementById("login_form__password").value
    })
    await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        mode: "cors",
        body: usuario
    })
    .then(resp => resp.json())
    .then(resp => {if(resp.status == 'error'){
        typeof(resp.error) == "string" ? alert(resp.error) : alert("Inicio de sesión fallido")
        }
        else if (resp.status == "success"){
            socket.emit("login")
            alert("Inicio de sesión exitoso. Será redirigido al Home.")
            window.location.href = "http://localhost:8080/"
        }})
    .catch(err => alert(err))
    
}

function login_github(){
    window.location.href = "http://localhost:8080/api/auth/github"
}

login.addEventListener("click", login_solititude)
github_login.addEventListener("click", login_github)
