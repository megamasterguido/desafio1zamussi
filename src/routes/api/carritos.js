import { Router } from "express"
import CartManager from "../../../CartManager.js"
const router = Router()

let Carritos = new CartManager("./Carritos.json")

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

router.get('/:pid',(req,res)=> {

    let {cid} = req.params
    let resp = Carritos.getCartsById(cid)
    
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

export default router
