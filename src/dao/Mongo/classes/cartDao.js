import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import {Types} from 'mongoose'
import { ticketModel } from "../models/ticket.model.js";

class CartDaoMongo{
    constructor(){
        this.cartModel = cartModel
        this.ticketModel = ticketModel
    }

    getCarts = async (limit) => {
        if(limit){
            return await cartModel.find().limit(limit).populate('products._id')
        }
        else{
            return await cartModel.find().populate('products._id')  
        }
    }

    getCart = async (cid) => {
        let resp = await cartModel.findById(cid).populate('products._id')
        resp.products.sort(
            function(a,b){
                return a._id.title > b._id.title ? 1: -1
            })
        return resp
    }

    getBill = async (cid) => {
        return await cartModel.aggregate([
            {$match: {_id: new Types.ObjectId(cid)}},
            {$unwind: "$products"},
            {$lookup:{
                from:"products",
                localField:"products._id",
                foreignField:"_id",
                as:"product"
            }},
            {$unwind:"$product"},
            {$set:{
                total:{$multiply:["$products.units", "$product.price"]}
            }},
            {$group:{
                _id:"$_id",
                total:{$sum:"$total"}
            }}
        ])
    }

    addCart = async() => {
        return await cartModel.create({products: []})
    }

    addProduct = async (cid, pid, units) => {
        let carrito = await cartModel.findById(cid)
        let prod = await productModel.findById(pid)
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
                }
                else{
                    resp = "Carrito no encontrado"
                }
                resp = await cartModel.findByIdAndUpdate(cid, {
                    products: carrito.products
                },
                {new: true})
            }
        }
        else{
            resp = "Producto no encontrado"
        }
        return resp
    }

    deleteProduct = async (cid, pid, units) => {
        let carrito = await cartModel.findById(cid)
        let prod = await productModel.findById(pid)
        let resp
        if(carrito){
            let find = carrito.products.find(item => item._id == pid)
            if(find){
                
                if(find.units >= units){
                    
                    if(find.units == units){
                        carrito.products.splice(carrito.products.indexOf(find), 1)
                    }
                    else{
                        carrito.products[carrito.products.indexOf(find)].units = parseInt(find.units) - parseInt(units)
                
                    }
                    resp = await cartModel.findByIdAndUpdate(cid, {
                        products: carrito.products
                    },
                    {new: true})
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
        let carrito = await cartModel.findById(cid)
        let cant
        let pid
        let producto
        carrito.products.forEach(async (prod) => {
            cant = prod.units
            pid = prod._id
            producto = await productModel.findById(pid)
            await productModel.findByIdAndUpdate(pid,
                {stock: producto.stock + parseInt(cant)}
                )
        })
        await cartModel.findByIdAndDelete(cid)
    }

    purchase = async (purchase_datetime, amount, purchaser, cid) => {
        let total = amount
        let cart = cartModel.findById(cid)
        let prod
        let prods = []
        for(let i = 0; i < cart.products.length; i++){
            prod = cart.products[i]
            if(prod.units > prod._id.stock){
                total -= prod.units * prod._id.price
                prods.push({_id:prod._id._id, units:prod.units})
            }
            else{
                await productModel.findByIdAndUpdate(prod._id._id,{stock: parseInt(prod._id.stock) - parseInt(prod.units)})
            }
        }
        cartModel.findByIdAndUpdate(cid, {products: prods})
        
        let resp = await ticketModel.create({
            purchase_datetime: purchase_datetime,
            amount: total,
            purchaser: purchaser
        })

        console.log("DAO RESP:", resp)

        return resp
    }
}

export default CartDaoMongo