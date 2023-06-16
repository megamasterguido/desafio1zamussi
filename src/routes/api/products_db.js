import { Router } from "express"
import { productModel } from "../../models/product.model.js"

const router = Router()

router.get('/',
    async (req,res) => {

    let limit = req.query.limit
    let filtrados

    try{
        if(limit){
            filtrados = await productModel.find().limit(limit)
        }
        else{
            filtrados = await productModel.find()
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
}
)

router.get('/:pid',
    async (req,res)=> {

    let {pid} = req.params
    let resp
    try{
        resp = await productModel.find({_id: pid})
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
            })
            res.send({
                status: "success",
                playload:resp
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
    let one

    try{
            one = await productModel.findByIdAndUpdate(pid, nuevo)
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