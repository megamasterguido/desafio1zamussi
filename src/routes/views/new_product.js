import { Router } from "express";
import is_admin from "../../middlewares/is_admin.js";

const router = Router()

router.get(
    "/",
    is_admin,
    async(req, res, next) => {
        try{
            return res.render('new_product', {title: 'Nuevo Producto', script: '/public/scripts/new_product.js', style:'/public/styles/styles.css'})
        }
        catch(error){
            next(error)
        }
    }
)

router.get(
    "/db",
    async(req, res, next) => {
        try{
            return res.render('new_product', {title: 'Nuevo Producto', script: '/public/scripts/new_product.js', style:'/public/styles/styles.css'})
        }
        catch(error){
            next(error)
        }
    }
)

export default router