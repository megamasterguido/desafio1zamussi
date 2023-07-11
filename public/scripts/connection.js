const socket = io()

let cart = document.getElementById('navCart_cant')
socket.emit("start")
socket.on("cart_updated", (data)=>{
    cart.innerText = data 
})

document.getElementById("user_session_logout").addEventListener("click", logout)

function logout(){
    fetch("http://localhost:8080/api/auth/logout", {method: "POST"})
    .then(resp => resp.json())
    .then(resp => alert(resp.response))
    .catch(err => console.error(err))
}