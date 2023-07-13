const socket = io()

function user_session_navbar(data){
    
    let user_session = document.getElementById("user_session")
    console.log(data)
    user_session.innerHTML = data

    let logout_session = document.getElementById("user_session_logout")
    console.log(logout_session)
    if(logout_session){
        logout_session.addEventListener("click", logout)
    }

}

let cart = document.getElementById('navCart_cant')
socket.emit("start")
socket.on("cart_updated", (data)=>{
    cart.innerText = data 
})

async function logout(){
    await fetch("http://localhost:8080/api/auth/logout", {method: "POST"})
    .then(resp => resp.json())
    .then(resp => {
        alert(resp.response)
        socket.emit("logout")
        })
    .catch(err => console.error(err))
}

socket.on("session_update", (data)=>{
    user_session_navbar(data)
})