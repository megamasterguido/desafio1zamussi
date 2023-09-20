import jwt from 'jsonwebtoken'
import config from '.././config.js'

export default (req,res,next) => {
    req.token = jwt.sign(
        { mail:req.body.mail },
        config.jwt,
        { expiresIn:60*60*24 }
    )
    return next()
}
