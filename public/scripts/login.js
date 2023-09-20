let login = document.getElementById("login_form__button")
let github_login = document.getElementById("login_github_button")

async function login_solititude(){

    let usuario = JSON.stringify({
        mail: document.getElementById("login_form__mail").value,
        password: document.getElementById("login_form__password").value
    })
    await fetch("http://localhost:"+ port +"/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        mode: "cors",
        body: usuario
    })
    .then(resp => resp.json())
    .then(async resp => {
        if (resp.success){
            socket.emit("login", resp.response.cart)
            cart_id = resp.response.cart
            alert("Inicio de sesión exitoso. Será redirigido al Home.")
            window.location.href = "/"
        }
        else{
            typeof(resp.error) == "string" ? alert(resp.error) : alert("Inicio de sesión fallido")            
        }})
    .catch(err => alert(err))
}

function login_github(){
    window.location.href = "http://localhost:"+ port +"/api/auth/github"
}

login.addEventListener("click", login_solititude)
github_login.addEventListener("click", login_github)
