import { Router } from "express"
import ProductManager from "../../dao/managers/ProductManager.js"
import { productModel } from "../../models/product.model.js"
const router = Router()

let Productos = new ProductManager("src/data/products.json")

router.get('/',
    async (req,res) => {

    let page = req.query.page ?? 1
    let limit = req.query.limit ?? 6
    let title = new RegExp(req.query.title, 'i') ?? ''
    let filtrados

    try{
        filtrados = await productModel.paginate(
            {title},
            {limit, page})
        res.send({
            status: "success",
            response: filtrados
        })
    }
    catch(error){            

        res.send({
            status: "error",
            error: error
        })
    }        
}
)

router.get('/:pid',
    async (req,res)=> {

    let {pid} = req.params
    let resp
    try{
        resp = await productModel.find({_id: pid})
        resp = resp[0]
        res.send({
            status: "success",
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

router.post('/',
    async (req, res) => {
        let {title, description, price, thumbnail, stock} = req.body
        try{
            let resp = await productModel.create({
                title,
                description,
                price,
                thumbnail,
                stock
            }).then( resp => {
                Productos.addProduct(
                    resp._id,
                    title, 
                    description,
                    price,
                    thumbnail,
                    stock)
                return resp
            }).catch(err => console.error(err))

            res.send({
                status: "success",
                response:resp
            })

        }
        catch(error){            

            res.send({
                status: "error",
                error: error
            })
        }
        
    }
)

router.put('/:pid', async (req, res) => {

    let {pid} = req.params
    let nuevo = req.body
    let resp = {before: '', after: ''}

    try{
        let prod = Productos.updateProduct(pid, nuevo)
        let one = await productModel.findByIdAndUpdate(pid, nuevo)
        resp.before = one
        one = await productModel.find({_id: pid})
        resp.after = one
        res.send({
            status: "success",
            response : resp
        })

        }
        catch(error){            

            res.send({
                status: "error",
                error: error
            })
        }
})

router.delete('/:pid', async (req, res) => {

    let {pid} = req.params

    try{
        let prod = Productos.deleteProduct(pid)
        await productModel.findByIdAndDelete(pid)
        res.send({
            status: "success",
            response : "Producto eliminado"
        })
    }

    catch(error){            

        res.send({
            status: "error",
            error: error
        })
    }
})

export default router