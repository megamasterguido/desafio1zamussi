document.getElementById("register_form__button").addEventListener("click", register_solititude)

async function register_solititude(){
    const pass = document.getElementById("register_form__password").value
    const rep_pass = document.getElementById("register_form__repeat_password").value
    if(pass == rep_pass){
        let nuevo = {
            name: document.getElementById("register_form__name").value,
            mail: document.getElementById("register_form__mail").value,
            age: document.getElementById("register_form__age").value,
            password: document.getElementById("register_form__password").value
        }
        let rol = document.getElementById("register_form__role").value
        let foto = document.getElementById("register_form__photo").value
        if(rol) nuevo.role = rol;
        if(foto) nuevo.photo = foto;
        await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            mode: "cors",
            body: JSON.stringify(nuevo)
        })
        .then(resp => resp.json())
        .then(resp => {if(resp.status == 'error'){
            typeof(resp.error) == "string" ? alert(resp.error) : alert("Rol no encontrado")
            }
            else if (resp.status == "success"){
                alert("Usuario creado con éxito. Será redirigido al Home.")
                window.location.href = "http://localhost:8080/"
            }})
        .catch(err => alert(err))
    }
    else{
        alert("Las contraseñas no coinciden")
    }
}


document.getElementById("register_github_button").addEventListener("click", register_github)

async function register_github(){
    window.location.href = "http://localhost:8080/api/auth/github"
}