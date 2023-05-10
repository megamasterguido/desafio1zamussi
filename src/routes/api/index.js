import { Router } from "express"
import productos_router from "./productos.js"
import carritos_router from "./carritos.js"

const router = Router()

router.use('/productos', productos_router)
router.use('/carritos', carritos_router)

export default router
