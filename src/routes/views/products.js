import { Router } from "express"
import porducts_db from "./products_db.js"
const router = Router()

router.use('/db', porducts_db)

router.get('/', async(req,res,next)=> {
    try {
        return res.render('products',{ title:'Productos', script: '/public/scripts/products.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})

router.get('/:pid', async(req,res,next)=> {
    try {
        return res.render('product',{ title:'Producto', script: '/public/scripts/product.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})

export default router
