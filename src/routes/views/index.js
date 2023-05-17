import { Router } from "express"
const router = Router()


router.get('/', async(req,res,next)=> {
    try {
        return res.render('index',{ title:'index', name: "Guido", script: '/public/connection.js'})
    } catch(error) {
        next(error)
    }
})

export default router
