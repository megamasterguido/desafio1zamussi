import { Router } from "express"
const router = Router()

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
