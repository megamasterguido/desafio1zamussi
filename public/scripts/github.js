async function github_success(){
    alert("Inicio de sesión exitoso. Será redirigido al Home.")
}

github_success()
    .then(() => socket.emit("login"))
    .then(() => window.location.href = "http://localhost:8080/")