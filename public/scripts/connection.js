const socket = io()

let cart = document.getElementById('navCart_cant')
socket.emit("start")
socket.on("cart_updated", (data)=>{
    cart.innerText = data 
})

