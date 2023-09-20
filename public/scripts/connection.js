const socket = io()
let port = window.location.href.substring(17,21)

let cart_id

fetch("/api/auth/current")
.then(resp => resp.json())
.then(resp => resp.response)
.then(resp => cart_id = resp.cart)
.catch(err => console.error(err))


function user_session_navbar(data){
    
    let user_session = document.getElementById("user_session")
    user_session.innerHTML = data

    let logout_session = document.getElementById("user_session_logout")
    if(logout_session){
        logout_session.addEventListener("click", logout)
    }

}

let cart = document.getElementById('navCart_cant')
socket.emit("start")
socket.on("cart_updated", (data)=>{
    cart.innerText = data.products.length
})

async function logout(){
    await fetch("/api/auth/logout", {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json",
                    "authorization": ''}})
    .then(resp => resp.json())
    .then(resp => {
        alert(resp.response)
        socket.emit("logout")
        window.location.href = "/"
        })
    .catch(err => console.error(err))
}

socket.on("session_update", (data)=>{
    user_session_navbar(data)
})