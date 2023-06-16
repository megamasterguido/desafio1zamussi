import { Router, response } from "express"
import { cartModel } from "../../models/cart.model.js"
import { productModel } from "../../models/product.model.js"

const router = Router()

router.get('/',async (req,res)=> {

    let limit = req.query.limit
    let filtrados

    try{  
        if(limit){
            filtrados = await cartModel.find().limit(limit)
        }
        else{
            filtrados = await cartModel.find()
    }
        res.send({
            succes: true,
            response: filtrados
        })
    }
    catch(error){            

        res.send({
            status: "error",
            error: error
        })
    }        

})

router.get('/:cid',async (req,res)=> {
    let {cid} = req.params
    let resp
    try{
        resp = await cartModel.find({_id: cid})
        res.send({
            succes: true,
            response: resp[0]
        })
    }
    catch(error){            

        res.send({
            status: "error",
            error: error
        })
    }
})

router.post('/', async (req, res) => {
    
    let resp
    try{
        resp = await cartModel.create({products: []})
        res.send({
            succes: true,
            response: resp
        })
    }
    catch(error){            

        res.send({
            status: "error",
            error: error
        })
    }
})

router.put("/:cid/products/:pid/:units", async (req, res) => {
    
    let {cid, pid, units} = req.params

    await productModel.find().then(
        resp => resp.json()
    )
    .then(
        resp => console.log(resp)
    )
    .catch(err => console.error(err))

    try{
        let carrito = await cartModel.findById(cid)
        let prod = await productModel.findById(pid)
        let resp

        if(prod){
            if(prod.stock < units){
                resp = "No se pueden agregar tantas unidades"
                res.send({
                    succes: false,
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
                        carrito.products.push({id: pid, units: parseInt(units)})
                    }
                }
                else{
                    resp = "Carrito no encontrado"
                    res.send({
                        succes: false,
                        response: resp
                    })
                }
                await productModel.findByIdAndUpdate(pid,{stock: parseInt(prod.stock) - parseInt(units)})
                resp = await cartModel.findByIdAndUpdate(cid, {
                    products: carrito.products
                },
                {new: true})
                res.send({
                    succes: true,
                    response: resp
                })
            }
        }
        else{
            resp = "Producto no encontrado"
            res.send({
                succes: false,
                response: resp
            })
        }
    }
    catch(error){            

        res.send({
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
                        carrito.products.splice(carrito.products.indexOf(find))
                    }
                    else{
                        carrito.products[carrito.products.indexOf(find)].units = parseInt(find.units) - parseInt(units)
                
                    }
                    resp = await cartModel.findByIdAndUpdate(cid, {
                        products: carrito.products
                    },
                    {new: true})
                    
                    if(prod){
                        await productModel.findByIdAndUpdate(pid,{
                            stock: prod.stock + parseInt(units)
                        })
                        res.send({
                            succes: true,
                            response: resp
                        })
                    }
                    else{
                        resp = "No se pudo encontrar el articulo en la base de datos, pero se retiro igualmente del carrito."
                        res.send({
                            succes: true,
                            response: resp
                        })
                    }

                    

                }
                else{
                    resp = "No hay tantas unidades del producto en el carrito"
                    res.send({
                        succes: false,
                        response: resp
                    })
                }
            }
            else{
                resp = "Producto no encontrado en el carrito"
                res.send({
                    succes: false,
                    response: resp
                })
            }
        }
        else{
            resp = "Carrito no encontrado"
            res.send({
                succes: false,
                response: resp
            })
        }
    }
    catch(error){            

        res.send({
            status: "error",
            error: error
        })
    }
})

export default router