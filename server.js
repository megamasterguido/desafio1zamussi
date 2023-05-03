import express from 'express'
import ProductManager from './ProductManager.js'
import CartManager from './CartManager.js'

const server = express()


let Productos = new ProductManager("./Productos.json")
let Carritos = new CartManager("./Carritos.json")

const puerto = 2727
const products = (req, res) => {

    let limit = req.query.limit
    let filtrados

    if(req.query.limit){
        filtrados = Productos.getProducts().slice(0, limit)
    }
    else{
        filtrados = Productos.getProducts()
    }
    

    return res.send({
    succes: true,
    response: filtrados
})}

server.get('/api/products/', products)

const productById = (req, res) => {

    let {pid} = req.params
    let resp = Productos.getProductById(pid)
    
    if(typeof(resp) == "string"){
        return res.send({
        succes: false,
        response: []
        })
    }
    else{
        return res.send({
        succes: true,
        response: resp
        })
    }
}

server.get('/api/products/:pid', productById)

const carts = (req, res) => {

    let limit = req.query.limit
    let filtrados

    if(req.query.limit){
        filtrados = Carritos.getCarts().slice(0, limit)
    }
    else{
        filtrados = Carritos.getCarts()
    }
    

    return res.send({
    succes: true,
    response: filtrados
})}

server.get('/api/carts/', carts)

const cartsById = (req, res) => {

    let {cid} = req.params
    let resp = Carritos.getCartsById(cid)
    
    if(typeof(resp) == "string"){
        return res.send({
        succes: false,
        response: []
        })
    }
    else{
        return res.send({
        succes: true,
        response: resp
        })
    }
}

server.get('/api/carts/:cid', cartsById)

server.use(express.urlencoded({extended:true}))
server.listen(puerto)