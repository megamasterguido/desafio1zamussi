import { Router } from "express";

const router = Router()

router.get(
    "/",
    async(req, res, next) => {
        try{
            return res.render('new_product', {title: 'Nuevo Producto', script: '/public/new_product.js', style:'/public/styles/styles.css'})
        }
        catch(error){
            next(error)
        }
    }
)

export default router