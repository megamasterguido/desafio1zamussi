import { compareSync } from 'bcrypt'

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

        return res.sendUserError('Contraseña incorrecta')
    }
    else{
        return res.sendUserError('Usuario no encontrado.', 404)
    }
}
