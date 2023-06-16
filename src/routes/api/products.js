import { Router } from "express"
import ProductManager from "../../dao/managers/ProductManager.js"
import products_db from "./products_db.js"
const router = Router()

let Productos = new ProductManager("src/data/products.json")

router.use('/db', products_db)

router.get('/',(req,res)=> {

        let limit = req.query.limit
        let filtrados

        if(req.query.limit){
            filtrados = Productos.getProducts().slice(0, limit)
        }
        else{
            filtrados = Productos.getProducts()
        }
        

        res.send({
        succes: true,
        response: filtrados
        })
    }
)

router.get('/:pid',(req,res)=> {

    let {pid} = req.params
    let resp = Productos.getProductById(pid)
    
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

    let nuevo = req.body
    let resp = Productos.addProduct(nuevo.title, nuevo.description, +nuevo.price, nuevo.thumbnail, +nuevo.stock)

    res.send({
        succes: true,
        response: resp
    })
})

router.put('/:pid', (req, res) => {

    let {pid} = req.params
    let nuevo = req.body
    let resp = Productos.updateProduct(pid, nuevo)

    res.send({
        succes: true,
        response: resp
    })
})

router.delete('/:pid', (req, res) => {

    let {pid} = req.params
    let resp = Productos.deleteProduct(pid)

    res.send({
        succes: true,
        response: resp
    })
})

export default router