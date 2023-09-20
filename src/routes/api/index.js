import { Router } from "express"
import ProductRouter from "./products.js"
import CartRouter from "./carts.js"
import chat_router from "./chat.js"
import UserRouter from "./auth.js"

const api_router = Router()

api_router.use('/products', ProductRouter.getRouter())
api_router.use('/carts', CartRouter.getRouter())
api_router.use('/chatbot', chat_router)
api_router.use('/auth', UserRouter.getRouter())

export default api_router
