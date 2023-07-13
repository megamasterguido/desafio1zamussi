import {Router} from 'express'
import { userModel } from '../../models/user.model.js'
import register_validator from '../../middlewares/register_auth_validator.js'
import register_password_validator from '../../middlewares/register_password_validator.js'
import login_validator from '../../middlewares/login_validator.js'
import createHash from '../../middlewares/createHash.js'
import isValidPassword from '../../middlewares/isValidPassword.js'
import passport from 'passport'
import jwt_generate from '../../middlewares/jwt_generate.js'

const router = Router()

router.post(
    '/register',
    register_validator,
    register_password_validator,
    createHash,
    async (req, res) => {
        try{
            let {mail} = req.body
            let repetido = await userModel.find({mail:mail})
            if(repetido.length > 0){
                return res.json({
                    status: 'error',
                    error: "El correo ingresado ya pertenece a un usuario existente."
                })                
            }
            else{
                let resp = await userModel.create(req.body)
                return res.json({
                    status: 'success',
                    response: resp
                })
            }
        }
        catch(error){
            return res.json({
                status: "error",
                error: error
            })
        }
    }
)

router.post(
    '/login',
    login_validator,
    register_password_validator,
    isValidPassword,
    jwt_generate,
    async (req, res) => {
        try{
            return res.json({
                status: 'success',
                response: "Inicio de sesión exitoso"
            })                
        }
        catch(error){
            return res.json({
                status: "error",
                error: error
            })
        }
    }
)

router.post(
    '/logout',
    async(req, res) => {
        try{
            req.session.destroy()
            return res.json({
                status: "success",
                response: "Cierre de sesión exitoso"
            })
        }
        catch(error){
            return res.json({
                status: "error",
                error: error
            })
        }
    }
)

router.get(
    '/',
    async (req, res) => {
        try{
            let resp = {
                usuario: req.user || "Nada",
                session: req.session || "Nada"
            }
            return res.json({
                status: "success",
                response: resp
            })      
        }
        catch(error){
            return res.json({
                status: "error",
                error: error
            })
        }
    }
)

router.get('/github', passport.authenticate('github',{ scope:['user:email'] }), (req,res)=>{})

router.get(
    '/github/callback',     //endpoint
    passport.authenticate('github',{ failureRedirect:'/api/auth/fail-register-github' }),   //middleware con estrategia de auth de github
    (req,res)=> res.redirect('/')
)

router.get('/fail-register-github',(req,res)=> res.json({
    status: "error",
    response:'bad auth'
}))



export default router