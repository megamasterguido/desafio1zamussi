import { Router } from "express"
import ProductManager from "../../dao/managers/ProductManager.js"
import { productModel } from "../../models/product.model.js"
import jwt_auth from "../../middlewares/jwt_auth.js"
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
        return res.status(200).json({
            success: true,
            response: filtrados
        })
    }
    catch(error){            

        return res.status(500).json({
            success: false,
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
        return res.status(200).json({
            success: true,
            response: resp
        })
    }
    catch(error){            

        return res.status(500).json({
            success: false,
            error: error
        })
    }
})

router.post('/',
    jwt_auth,
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

            return res.status(201).json({
                success: true,
                response:resp
            })

        }
        catch(error){            

            return res.status(500).json({
                success: false,
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
        Productos.updateProduct(pid, nuevo)
        let one = await productModel.findByIdAndUpdate(pid, nuevo)
        resp.before = one
        one = await productModel.find({_id: pid})
        resp.after = one
        return res.status(202).json({
            success: true,
            response : resp
        })

        }
        catch(error){            

            return res.status(500).json({
                success: false,
                error: error
            })
        }
})

router.delete('/:pid', async (req, res) => {

    let {pid} = req.params

    try{
        let prod = Productos.deleteProduct(pid)
        await productModel.findByIdAndDelete(pid)
        return res.status(202).json({
            success: true,
            response : "Producto eliminado"
        })
    }

    catch(error){            

        return res.status(500).json({
            success: false,
            error: error
        })
    }
})

export default router