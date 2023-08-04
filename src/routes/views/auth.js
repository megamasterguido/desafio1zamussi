import { Router } from "express"
const router = Router()

router.get('/register', async(req,res,next)=> {
    try {
        return res.render('register',{ title:'Register', script: '/public/scripts/register.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})

router.get('/login', async(req,res,next)=> {
    try {
        return res.render('login',{ title:'Log in', script: '/public/scripts/login.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})

router.get('/github_success', async(req,res,next)=> {
    try {
        return res.render('index',{ title:'Github Success', script: '/public/scripts/github.js', style: "/public/styles/styles.css"})
    } catch(error) {
        next(error)
    }
})


export default router
