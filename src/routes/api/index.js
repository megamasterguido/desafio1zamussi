import { Router } from "express"
import productos_router from "./products.js"
import carritos_router from "./carts.js"
import chat_router from "./chat.js"

const router = Router()

router.use('/products', productos_router)
router.use('/carts', carritos_router)
router.use('/chatbot', chat_router)

export default router
