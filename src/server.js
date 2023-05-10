import express from 'express'
import router from './routes/index.js'

const server = express()

const puerto = 8080

server.use(express.urlencoded({extended:true}))
server.use(express.json())

server.listen(puerto)

server.use('/', router)