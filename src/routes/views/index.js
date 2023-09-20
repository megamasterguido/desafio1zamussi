import { Router } from "express"
const views_router = Router()
import products_router from "./products.js"
import chat_router from "./chat.js"
import carts_router from "./carts.js"
import new_product_router from "./new_product.js"
import user_router from "./auth.js"

views_router.get('/', async(req,res,next)=> {
    try {
        return res.render('index',{ title:'Inicio', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})

views_router.use("/products", products_router)
views_router.use("/chatbot", chat_router)
views_router.use("/carts", carts_router)
views_router.use("/new_product", new_product_router)
views_router.use("/auth", user_router)

export default views_router
