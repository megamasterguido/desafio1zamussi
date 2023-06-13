import app from "./app.js";
import { Server } from "socket.io";

const puerto = 8080

let http_server = app.listen(puerto)
let socket_server = new Server(http_server)

socket_server.on(
    'connection',
    socket => {
        console.log("connected")
    }
)