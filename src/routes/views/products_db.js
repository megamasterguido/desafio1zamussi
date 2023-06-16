import { Router } from "express"
const router = Router()


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
