import { Router } from "express"
import CartManager from "../../dao/managers/CartManager.js"
import carts_db from "./carts_db.js"

const router = Router()

let Carritos = new CartManager("src/data/carts.json")

router.use("/db", carts_db)

router.get('/',(req,res)=> {

    let limit = req.query.limit
    let filtrados

    if(req.query.limit){
        filtrados = Carritos.getCarts().slice(0, limit)
    }
    else{
        filtrados = Carritos.getCarts()
    }
    

    res.send({
    succes: true,
    response: filtrados
})})

router.get('/:cid',(req,res)=> {

    let {cid} = req.params
    let resp = Carritos.getCartById(cid)
    
    if(typeof(resp) == "string"){
        res.send({
        succes: false,
        response: []
        })
    }
    else{
        res.send({
        succes: true,
        response: resp
        })
    }
})

router.post('/', (req, res) => {

    let resp = Carritos.addCart()

    res.send({
        succes: true,
        response: resp
    })
})

router.put("/:cid/products/:pid/:units", (req, res) => {
    let {cid, pid, units} = req.params

    let resp = Carritos.addProduct(cid, pid, +units)

    res.send({
        succes: true,
        response: resp
    })
})

router.delete("/:cid/products/:pid/:units", (req, res) => {
    let {cid, pid, units} = req.params

    let resp = Carritos.deleteProduct(cid, pid, +units)

    res.send({
        succes: true,
        response: resp
    })
})

export default router
