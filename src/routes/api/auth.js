import {Router} from 'express'
import { userModel } from '../../models/user.model.js'
import register_validator from '../../middlewares/register_auth_validator.js'
import register_password_validator from '../../middlewares/register_password_validator.js'
import login_validator from '../../middlewares/login_validator.js'
import createHash from '../../middlewares/createHash.js'
import isValidPassword from '../../middlewares/isValidPassword.js'

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
    async (req, res) => {
        try{
            let {mail, password} = req.body
            let user = await userModel.findOne({mail:mail})
            if(user){                
                if(user.password == password){
                    req.session.mail = mail
                    req.session.role = user.role
                    return res.json({
                        status: 'success',
                        response: "Inicio de sesión exitoso"
                    })
                }
                else{
                    return res.json({
                        status: 'error',
                        error: "Contraseña incorrecta"
                    })
                }
            }
            return res.json({
                status: 'error',
                error: "Usuario no encontrado"
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
            console.log(req.session)
            if(req.session.mail){
                return res.json({
                    status: "success",
                    response: req.session.mail
                })                
            }
            else{
                return res.json({
                    status: "success",
                    response: "No hay ninguna sesión en curso"
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

export default router