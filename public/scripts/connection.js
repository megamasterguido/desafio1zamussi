const socket = io()

let cart = document.getElementById('navCart_cant')
let cart_db = document.getElementById('navCart_cant_mongo')
socket.emit("start")
socket.on("cart_updated", (data)=>{
    cart.innerText = data 
})
socket.on("cart_db_updated", (data)=>{
    cart_db.innerText = data 
})