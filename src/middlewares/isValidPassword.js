import { compareSync } from 'bcrypt'
import { userModel } from '../models/user.model.js'

export default async function isValidPassword(req, res, next) {
    
    let user = req.user
    if(user){
        let verified = compareSync(
            req.body.password,
            user.password
        )
            
        if (verified) {
            req.session.mail = user.mail
            req.session.role = user.role
            return next()
        }

        return res.status(400).json({
            success: false,
            error: 'Contraseña incorrecta'
        })
    }
    else{
        return res.status(404).json({
            success: false,
            error: 'Usuario no encontrado.'
        })
    }
}
