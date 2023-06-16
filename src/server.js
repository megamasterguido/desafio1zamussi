import app from "./app.js";
import { Server } from "socket.io";
import fs from "fs";
import mongoose from "mongoose";

const puerto = 8080

let http_server = app.listen(puerto)
let socket_server = new Server(http_server)

mongoose.connect("mongodb+srv://megamasterguido:megamasterguido1611@coderhouse.ha2xgah.mongodb.net/?retryWrites=true&w=majority")

let chat = []
let cart
let cart_db

function update_cart(){
    cart = JSON.parse(fs.readFileSync("src/data/carts.json"))[0].products
    socket_server.emit("cart_updated", cart.length)
}


async function update_cart_db(){
    cart_db = await fetch("http://localhost:8080/api/carts/db/648bb2c828ddea6a745e4901")
        .then(resp => resp.json())
        .then(resp => resp.response)
        .then(resp => resp.products)
        .catch(err => console.log(err))
    await socket_server.emit("cart_db_updated", cart_db.length)
}

socket_server.on(
    'connection',
    socket => {
        console.log("connected")
        socket.on("start", () => {
            update_cart_db()
            update_cart()
        })
        socket.on("cart_req", () => {
            cart = JSON.parse(fs.readFileSync("src/data/carts.json"))[0].products
            socket_server.emit("cart_res", cart)
        })
        socket.on("cart_req_db", async () => {
            cart_db = await fetch("http://localhost:8080/api/carts/db/648bb2c828ddea6a745e4901")
            .then(resp => resp.json())
            .then(resp => resp.response)
            .then(resp => resp.products)
            .catch(err => console.log(err))
            socket_server.emit("cart_res_db", cart_db)
        })
        socket.on("new_message", (data) => {
            chat.push(data)
            socket_server.emit("chat", chat)
        })
        socket.on("auth", () => {
            socket_server.emit("chat", chat)
        })
        socket.on("cart_update", update_cart)
        socket.on("cart_update_db", update_cart_db)
    }
)