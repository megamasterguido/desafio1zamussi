import { Router } from "express"
import carts_db from "./carts_db.js"
const router = Router()

router.use('/db', carts_db)

router.get('/', async(req,res,next)=> {
    try {
        return res.render('carts',{ title:'Carrito', script: '/public/scripts/cart.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})

router.get('/:cid', async(req,res,next)=> {
    try {
        return res.render('carts',{ title:'Carrito', script: '/public/scripts/cart.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})



export default router
