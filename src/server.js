import app from "./app.js";
import { Server } from "socket.io";
import fs from "fs";

const puerto = 8080

let http_server = app.listen(puerto)
let socket_server = new Server(http_server)

let chat = []
let cart

function update_cart(){
    cart = JSON.parse(fs.readFileSync("src/carts.json"))[0].products
    socket_server.emit("cart_updated", cart.length)
}

socket_server.on(
    'connection',
    socket => {
        console.log("connected")
        socket.on("start", update_cart)
        socket.on("cart_req", () => {
            cart = JSON.parse(fs.readFileSync("src/carts.json"))[0].products
            socket_server.emit("cart_res", cart)
        })
        socket.on("new_message", (data) => {
            chat.push(data)
            socket_server.emit("chat", chat)
        })
        socket.on("auth", () => {
            socket_server.emit("chat", chat)
        })
        socket.on("cart_update", update_cart)
    }
)