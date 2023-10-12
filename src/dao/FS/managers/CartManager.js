import fs from 'fs'
import ProductManager from "./ProductManager.js"

let products = new ProductManager()

function populate(cart){
    let resp = JSON.parse(JSON.stringify(cart.products))
    resp.forEach(prod => {
        let product = products.getProduct(prod._id)
        prod._id = product
    })
    return {_id: cart._id, products: resp}
}

export default class CartManager{
    constructor(){
        this.carts = []
        this.path = "src/dao/FS/data/carts.json"
        this.ticketPath = "src/dao/FS/data/tickets.json"
        this.lastId = 0
        this.ticketLastId = 0
        this.init(this.path)
    }

    init(path){
        let file = fs.existsSync(path)
        let resp
        if(file){
            let archivo = fs.readFileSync(path, "UTF-8")
            try{
                this.carts = JSON.parse(archivo)
                resp = "Datos recuperados"
                this.carts.forEach(cart => {
                    if(cart._id >= this.lastId){
                        this.lastId = cart._id
                    }
                })
            }
            catch{
                resp = "Datos irrecuperables"
            }
        }
        else{
            fs.writeFileSync(path, "[]")
            resp = "Archivo creado"
        }
        return resp
    }

    initTickets(ticketPath){
        let file = fs.existsSync(ticketPath)
        let resp
        if(file){
            let archivo = fs.readFileSync(ticketPath, "UTF-8")
            try{
                this.tickets = JSON.parse(archivo)
                resp = "Datos recuperados"
                this.tickets.forEach(ticket => {
                    if(ticket._id >= this.ticketLastId){
                        this.ticketLastId = ticket._id
                    }
                })
            }
            catch{
                resp = "Datos irrecuperables"
            }
        }
        else{
            fs.writeFileSync(ticketPath, "[]")
            resp = "Archivo creado"
        }
        return resp
    }

    getBill = (cid) => {
        let resp = 0
        const carrito = this.getCart(cid)
        carrito.products.forEach(prod => {
            resp += prod.units * prod._id.price
        })

        return resp
    }

    addCart = () => {
        let cid = this.lastId + 1
        this.lastId++
        this.carts.push({_id: cid, products: []})
        fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2), 'utf8')
        return this.getCart(cid)
    }

    getCarts = (limit) => {
        let resp = []
        if(limit){
            for(let i = 0; i <limit; i++){
                if(this.carts[i]){
                    resp[i] = populate(this.carts[i])
                }
                else{
                    break
                }
            }
            return resp
        }
        else{
            this.carts.forEach(cart => {
                resp.push(populate(cart))
            })
        }
        return resp
    }

    getCart = (cid) => {        
        let resp = this.carts.find(cart => cart._id == cid)
        resp = populate(resp)
        resp.products = resp.products.sort(
            function(a,b){
                return a._id.title > b._id.title ? 1: -1
            })
        return resp
    }

    addProduct = (cid, pid, units) => {
        let carrito = this.carts.find(cart => cart._id == cid)
        let prod = products.getProduct(pid)
        let resp

        if(prod){
            if(prod.stock < units){
                resp = "No se pueden agregar tantas unidades"
            }
            else{
                let find
                if(carrito){
                    find = carrito.products.find(prod => prod.id == pid)
                    if(find){
                        find.units = parseInt(find.units) + parseInt(units)
                    }
                    else{
                        carrito.products.push({_id: pid, units: parseInt(units)})
                    }
                    fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2))
                    resp = carrito
                }
                else{
                    resp = "Carrito no encontrado"
                }
            }
        }
        else{
            resp = "Producto no encontrado"
        }
        return resp

    }

    deleteProduct = (cid, pid, units) => {
        let carrito = this.carts.find(cart => cart._id == cid)
        let prod = products.getProduct(pid)
        let resp
        if(carrito){
            let find = carrito.products.find(item => item._id == pid)
            if(find){
                
                if(find.units >= units){
                    
                    if(find.units == units){
                        this.carts.find(cart => cart._id == cid)
                        carrito.products.splice(carrito.products.indexOf(find), 1)
                    }
                    else{
                        carrito.products[carrito.products.indexOf(find)].units = parseInt(find.units) - parseInt(units)
                
                    }
                    fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2))
                    resp = carrito
                    if(!prod){
                        resp = "No se pudo encontrar el articulo en la base de datos, pero se retiro igualmente del carrito."
                    }
                }
                else{
                    resp = "No hay tantas unidades del producto en el carrito"
                }
            }
            else{
                resp = "Producto no encontrado en el carrito"
            }
        }
        else{
            resp = "Carrito no encontrado"
        }

        return resp
    }

    deleteCart = async (cid) => {
        let carrito = this.getCart(cid)
        let cant
        let pid
        let product
        carrito.products.forEach(prod => async () => {
            cant = prod.units
            pid = prod._id
            product = products.getProduct(pid)
            products.updateProduct(pid, {stock: product.stock + parseInt(cant)})
        });
        this.carts.splice(this.carts.indexOf(carrito),1)
        fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2))
    }

    purchase = async (purchase_datetime, amount, purchaser, cid) => {
        let total = amount
        let cart = this.carts.find(cart => cart._id == cid)
        let prod
        let prods = []
        let ticket

        for(let i = 0; i < cart.products.length; i++){
            prod = cart.products[i]
            if(prod.units > prod._id.stock){
                total -= prod.units * prod._id.price
                prods.push({_id:prod._id._id, units:prod.units})
            }
            else{
                products.updateProduct(prod._id._id, {stock: parseInt(prod._id.stock) - parseInt(prod.units)})
            }
        }

        cart.products = prods

        this.ticketLastId++

        ticket = {
            _id: this.ticketLastId,
            purchase_datetime: purchase_datetime,
            amount: total,
            purchaser: purchaser
        }

        fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2))
        fs.writeFileSync(this.ticketPath, JSON.stringify(this.tickets,null,2))

        return ticket
    }
}