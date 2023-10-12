import app from "./app.js";
import { Server } from "socket.io";
import config from "./config.js";

const puerto = config.port

let http_server = app.listen(puerto)
let socket_server = new Server(http_server)

let chat = []
let cart_id
let cart 
let user_session = [`
<a id="user_session_register" href="/auth/register">
    Register
</a>
<a id="user_session_login" href="/auth/login">
    Log in
</a>`,
`
    <a id="user_session_logout" href="#">
        Log out
    </a>`
]
let user_session_navbar = 0

async function update_cart(){
    if(cart_id){
        cart = await fetch("http://localhost:"+ config.port +"/api/carts/" + cart_id)
        .then(resp => resp.json())
        .then(resp => resp.response)
        .catch(err => console.error(err))
        socket_server.emit("cart_updated", cart)
    }
}

socket_server.on(
    'connection',
    socket => {
        console.log("connected")
        socket.on("start", async () => {
            update_cart()
            socket_server.emit("session_update", user_session[user_session_navbar])
        })
        socket.on("cart_req", async () => {
            cart = await fetch("http://localhost:"+ config.port +"/api/carts/" + cart_id)
            .then(resp => resp.json())
            .then(resp => resp.response)
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
        socket.on("login", async (data)=>{
            cart_id = data
            update_cart()
            user_session_navbar = 1
            socket_server.emit("session_update", user_session[user_session_navbar])
        })
        socket.on("logout", ()=>{
            cart_id = false
            update_cart()
            user_session_navbar = 0
            socket_server.emit("session_update", user_session[user_session_navbar])
        })
    }
)