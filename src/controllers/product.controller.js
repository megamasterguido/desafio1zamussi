import {productService} from '../service.js'

class ProductController{
    constructor(){
        this.productService = productService
    }

    getProducts = async (req,res) => {

        let page = req.query.page ?? 1
        let limit = req.query.limit ?? 6
        let title = new RegExp(req.query.title, 'i') ?? ''
        let resp
        Number.isInteger(limit) ? limit : 6
        Number.isInteger(page) ? page : 1
        try{
            resp = await this.productService.getProducts(limit, page, title)
            return res.sendSuccess(resp)
        }
        catch(error){        
            return res.sendServerError(error)
        }        
    }

    getProduct = async (req,res)=> {

        let {pid} = req.params
        let resp
        try{
            resp = await this.productService.getProduct(pid)
            return res.sendSuccess(resp)
        }
        catch(error){            
            return res.sendServerError(error)
        }
    }

    addProduct = async (req, res) => {
        let {title, description, price, thumbnail, stock} = req.body
        try{
            let resp = await this.productService.addProduct(
                title,
                description,
                price,
                thumbnail,
                stock
            )

            return res.sendSuccess(resp, 201)

        }
        catch(error){            
            return res.sendServerError(error)
        }
        
    }

    deleteProduct = async (req, res) => {

        let {pid} = req.params

        try{
            await this.productService.deleteProduct(pid)
            return res.sendSuccess("Producto eliminado", 202)
        }

        catch(error){            
            return res.sendServerError(error)
        }
    }

    updateProduct =  async (req, res) => {

        let {pid} = req.params
        let nuevo = req.body

        try{
            let resp = await this.productService.updateProduct(pid, nuevo)
            return res.sendSuccess(resp, 202)
        }
        catch(error){            
            return res.sendServerError(error)
        }
    }
}

export default new ProductController()