import { compareSync } from 'bcrypt'
import { userModel } from '../models/user.model.js'

export default async function isValidPassword(req, res, next) {
    
    let user = await userModel.findOne({mail:req.body.mail})
    if(user){
        let verified = compareSync(
            req.body.password,
            user.password
        )
            
        if (verified) {
            return next()
        }

        return res.json({
            status: "error",
            error: 'Contraseña incorrecta'
        })
    }
    else{
        return res.json({
            status: "error",
            error: 'Usuario no encontrado.'
        })
    }
}
