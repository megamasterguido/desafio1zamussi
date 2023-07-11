document.getElementById("login_form__button").addEventListener("click", login_solititude)

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
            alert("Inicio de sesión exitoso. Será redirigido al Home.")
            window.location.href = "http://localhost:8080/api/auth/github"
        }})
    .catch(err => alert(err))
    
}

document.getElementById("login_github_button").addEventListener("click", login_github)

async function login_github(){
    window.location.href = "http://localhost:8080/api/auth/github"
}