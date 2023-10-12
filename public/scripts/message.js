function message(name, mess){
    let resp = `<div class="message">
                    <div class="name">${name}</div>
                    <div class="text">${mess}</div>
                </div>`
    return resp
}

async function send(mess){
    
    let rol = await fetch("http://localhost:8080/api/auth/current").then(resp => resp.json()).then(resp => resp.response.role).catch(err => console.error(err))

    if (mess.key === "Enter") {
        if(rol != 'admin'){
            socket.emit("new_message", {name:clientName, mess:new_message.value});
            new_message.value = ''
        }
        else{
            alert("Los administradores no pueden escribir en el chat.")
        }
    }

}

let new_message = document.getElementById("clientMessage")
let chatBox = document.getElementById("chatBox")

new_message.addEventListener("keyup", send)

let clientName = sessionStorage.getItem("client")
socket.emit("auth");

if(!clientName){
    Swal.fire({
            title: "Ingrese su nombre: ",
            input: "text",
            allowOutsideClick: false,
        }).then((res) => {
            res.value == '' ? clientName = "Anónimo": clientName = res.value;
            sessionStorage.setItem("client", clientName)
        });
}

socket.on("chat", (data) => {
    chatBox.innerHTML = data.map(elem => message(elem.name, elem.mess)).join('')
    chatBox.scrollTop = chatBox.scrollHeight
}); 