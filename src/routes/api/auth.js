import {Router} from 'express'
import { userModel } from '../../models/user.model.js'
import register_validator from '../../middlewares/register_auth_validator.js'
import register_password_validator from '../../middlewares/register_password_validator.js'
import login_validator from '../../middlewares/login_validator.js'
import createHash from '../../middlewares/createHash.js'
import isValidPassword from '../../middlewares/isValidPassword.js'
import passport from 'passport'
import jwt_generate from '../../middlewares/jwt_generate.js'
import passport_call from '../../middlewares/passport_call.js'

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
                return res.status(400).json({
                    success: false,
                    error: "El correo ingresado ya pertenece a un usuario existente."
                })                
            }
            else{
                let resp = await userModel.create(req.body)
                return res.status(201).json({
                    success: true,
                    response: resp
                })
            }
        }
        catch(error){
            return res.status(404).json({
                success: false,
                error: error
            })
        }
    }
)

router.post(
    '/login',
    login_validator,
    register_password_validator,
    passport.authenticate('login',{}),
    isValidPassword,
    jwt_generate,
    async (req, res) => {
        try{
            return res.status(202).cookie('token',req.token, {maxAge: 60 * 60 * 1000, httpOnly: true}).json({
                success: true,
                response: "Inicio de sesión exitoso"
            })                
        }
        catch(error){
            return res.status(500).json({
                success: false,
                error: error
            })
        }
    }
)

router.post(
    '/logout',
    passport_call('jwt'),
    async(req, res) => {
        try{
            req.session.destroy()
            return res.status(202).clearCookie('token').json({
                success: true,
                response: "Cierre de sesión exitoso"
            })
        }
        catch(error){
            return res.status(500).json({
                success: false,
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
            return res.status(200).json({
                success: true,
                response: resp
            })      
        }
        catch(error){
            return res.status(500).json({
                success: false,
                error: error
            })
        }
    }
)

router.get('/github', passport.authenticate('github',{ scope:['user:email'] }), (req,res)=>{})

router.get(
    '/github/callback',     //endpoint
    passport.authenticate('github',{ failureRedirect:'/api/auth/fail-register-github' }),   //middleware con estrategia de auth de github
    jwt_generate,
    (req,res)=> {
        res.status(200).cookie('token',req.token, {maxAge: 60 * 60 * 1000, httpOnly: true}).redirect('/auth/github_success')
    }
)

router.get('/fail-register-github',(req,res)=> res.status(400).json({
    success: false,
    response:'bad auth'
}))


export default router