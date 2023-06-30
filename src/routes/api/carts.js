import { Router } from "express"
import CartManager from "../../dao/managers/CartManager.js"
import { productModel } from "../../models/product.model.js"
import { cartModel } from "../../models/cart.model.js"
import {Types} from 'mongoose'

const router = Router()

let Carritos = new CartManager("src/data/carts.json")


router.get(
    '/bills/:cid',
    async (req, res) => {
        try{
            let resp = await cartModel.aggregate([
                {$match: {_id: new Types.ObjectId(req.params.cid)}},
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
            return res.json({
                status: "success",
                response: resp
            })
        }
        catch(error){
            return res.json({
                status: "error",
                error: error
            })
        }
    }
)

router.get('/',async (req,res)=> {

    let limit = req.query.limit
    let filtrados

    try{  
        if(limit){
            filtrados = await cartModel.find().limit(limit).populate('products._id')
        }
        else{
            filtrados = await cartModel.find().populate('products._id')
    }
        return res.json({
            status: "success",
            response: filtrados
        })
    }
    catch(error){            

        return res.json({
            status: "error",
            error: error
        })
    }        

})

router.get('/:cid',async (req,res)=> {
    let {cid} = req.params
    let resp
    try{
        resp = await cartModel.find({_id: cid}).populate({path:'products._id'})
        resp[0].products.sort(
            function(a,b){
                return a._id.title > b._id.title ? 1: -1
            })
        return res.json({
            status: "success",
            response: resp[0]
        })
    }
    catch(error){            

        return res.json({
            status: "error",
            error: error
        })
    }
})

router.post('/', async (req, res) => {
    
    let resp
    try{
        resp = await cartModel.create({products: []})
        .then(resp => {
            Carritos.addCart()
            return resp
        })
        .catch(
            err => console.error(err)
        )
        return res.json({
            status: "success",
            response: resp
        })
    }
    catch(error){            

        return res.json({
            status: "error",
            error: error
        })
    }
})


router.put("/:cid/products/:pid/:units", async (req, res) => {
    
    let {cid, pid, units} = req.params


    try{
        let carrito = await cartModel.findById(cid)
        let prod = await productModel.findById(pid)
        let resp

        if(prod){
            if(prod.stock < units){
                resp = "No se pueden agregar tantas unidades"
                return res.json({
                    status: "error",
                    response: resp
                })
            }
            else{
                let find
                if(carrito){
                    find =await carrito.products.find(prod => prod.id == pid)
                    if(find){
                        find.units = parseInt(find.units) + parseInt(units)
                    }
                    else{
                        carrito.products.push({_id: pid, units: parseInt(units)})
                    }
                }
                else{
                    resp = "Carrito no encontrado"
                    return res.json({
                        status: "error",
                        response: resp
                    })
                }
                await productModel.findByIdAndUpdate(pid,{stock: parseInt(prod.stock) - parseInt(units)})
                resp = await cartModel.findByIdAndUpdate(cid, {
                    products: carrito.products
                },
                {new: true})
                Carritos.addProduct(cid, pid, units)
                return res.json({
                    status: "succes",
                    response: resp
                })
            }
        }
        else{
            resp = "Producto no encontrado"
            return res.json({
                status: "error",
                response: resp
            })
        }
    }
    catch(error){            

        return res.json({
            status: "error",
            error: error
        })
    }
})


router.delete("/:cid/products/:pid/:units", async (req, res) => {
    
    let {cid, pid, units} = req.params

    try{
        let carrito = await cartModel.findById(cid)
        let prod = await productModel.findById(pid)
        let resp
        
        if(carrito){
            let find = carrito.products.find(item => item.id == pid)
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
                    Carritos.deleteProduct(cid, pid, +units)
                    if(prod){
                        await productModel.findByIdAndUpdate(pid,{
                            stock: prod.stock + parseInt(units)
                        })
                        return res.json({
                            status: "success",
                            response: resp
                        })
                    }
                    else{
                        resp = "No se pudo encontrar el articulo en la base de datos, pero se retiro igualmente del carrito."
                        return res.json({
                            status: "error",
                            response: resp
                        })
                    }
                }
                else{
                    resp = "No hay tantas unidades del producto en el carrito"
                    return res.json({
                        status: "error",
                        response: resp
                    })
                }
            }
            else{
                resp = "Producto no encontrado en el carrito"
                return res.json({
                    status: "error",
                    response: resp
                })
            }
        }
        else{
            resp = "Carrito no encontrado"
            return res.json({
                status: "error",
                response: resp
            })
        }
    }
    catch(error){            

        return res.json({
            status: "error",
            error: error
        })
    }
})

export default router
