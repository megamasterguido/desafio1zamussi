import { Router } from "express"
const router = Router()
import products_router from "./products.js"
import chat_router from "./chat.js"
import carts_router from "./carts.js"

router.get('/', async(req,res,next)=> {
    try {
        return res.render('index',{ title:'Inicio', name: "Guido", script: '/public/connection.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})

router.use("/products", products_router)
router.use("/chatbot", chat_router)
router.use("/carts", carts_router)

export default router
