import { Router } from "express"
const router = Router()


router.get('/', async(req,res,next)=> {
    try {
        return res.render('chat',{ title:'Chat', script: '/public/scripts/message.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})

export default router
