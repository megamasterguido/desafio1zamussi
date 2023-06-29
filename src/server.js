import app from "./app.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import 'dotenv/config.js'

const puerto = process.env.PORT || 8080

let http_server = app.listen(puerto)
let socket_server = new Server(http_server)

mongoose.connect(process.env.LINK_MONGO)

let chat = []
let cart

async function update_cart(){
    cart = await fetch("http://localhost:8080/api/carts/648ccc29ca71f8147c552fec")
        .then(resp => resp.json())
        .then(resp => resp.response)
        .then(resp => resp.products)
        .catch(err => console.error(err))
    socket_server.emit("cart_updated", cart.length)
}

socket_server.on(
    'connection',
    socket => {
        console.log("connected")
        socket.on("start", update_cart)
        socket.on("cart_req", async () => {
            cart = await fetch("http://localhost:8080/api/carts/648ccc29ca71f8147c552fec")
            .then(resp => resp.json())
            .then(resp => resp.response)
            .then(resp => resp.products)
            .catch(err => console.error(err))
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