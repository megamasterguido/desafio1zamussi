import { cartService } from "../service.js";

class CartController{
    constructor(){
        this.cartService = cartService
    }

    getBill = async (req, res) => {
        try{
            let {cid} = req.params
            let resp = await this.cartService.getBill(cid)
            return res.sendSuccess(resp, 201)
        }
        catch(error){
            return res.sendServerError(error)
        }
    }

    getCarts = async (req,res)=> {
        
        let limit = req.query.limit
        let resp
        if(limit) Number.isInteger(limit) ? limit : 6
        
        try{  
            resp = this.cartService.getCarts(limit)
            return res.sendSuccess(resp)
        }
        catch(error){            
            return res.sendServerError(error)
        }        
    
    }

    getCart = async (req,res)=> {
        let {cid} = req.params
        let resp
        try{
            resp = await this.cartService.getCart(cid)
            return res.sendSuccess(resp)
        }
        catch(error){            
            return res.sendServerError(error)
        }
    }

    addCart = async (req, res) => {
        try{
            let resp = await this.cartService.addCart()
            return res.sendSuccess(resp, 201)
        }
        catch(error){        
            return res.sendServerError(error)
        }
    }

    addProduct = async (req, res) => {
            
        let {cid, pid, units} = req.params
    
    
        try{
            let resp = await this.cartService.addProduct(cid, pid, units)
            
            switch (resp) {
                case "No se pueden agregar tantas unidades":
                    return res.sendUserError(resp)

                case "Carrito no encontrado":
                    return res.sendUserError(resp, 404)

                case "Producto no encontrado":
                    return res.sendUserError(resp, 404)
            
                default:
                    return res.sendSuccess(resp, 202)
            }
        }
        catch(error){            
            return res.sendServerError(error)
        }
    }

    deleteProduct = async (req, res) => {
            
        let {cid, pid, units} = req.params
    
        try{
            let resp = await this.cartService.deleteProduct(cid, pid, units)

            switch (resp) {
                case "No se pudo encontrar el articulo en la base de datos, pero se retiro igualmente del carrito.":
                    return res.sendServerError(resp)
                case "No hay tantas unidades del producto en el carrito":
                    return res.sendUserError(resp)
                case "Producto no encontrado en el carrito":
                    return res.sendUserError(resp, 404)
                case "Carrito no encontrado":
                    return res.sendUserError(resp, 404)
            
                default:
                    return res.sendSuccess(resp, 202)
            }
            
        }
        catch(error){            
            return res.sendServerError(error)
        }
    }

    deleteCart = async (req, res) => {
        let {cid} = req.params
        try{
            await this.cartService.deleteCart(cid)
            return res.sendSuccess("Carrito " + cid + " borrado exitosamente")
        }
        catch(error){            
            return res.sendServerError(error)
        }
    }

    purchase = async (req, res) => {
        let {cid} = req.params
        let {purchase_datetime, amount, purchaser} = req.body
        try {
            let resp = await this.cartService.purchase(purchase_datetime, amount, purchaser, cid)
            console.log("CONTROLLER RESP:", resp)
            return res.sendSuccess(resp)
        }
        catch(error) {
            return res.sendServerError(error)
        }
    }
}

export default new CartController()