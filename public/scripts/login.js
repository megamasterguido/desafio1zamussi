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
    .then(resp => {if(resp.status == 'error'){typeof(resp.error) == "string" ? alert(resp.error) : alert("Rol no encontrado")}})
    .catch(err => alert(err))
    
}