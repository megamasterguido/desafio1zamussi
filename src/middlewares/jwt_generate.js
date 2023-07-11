import jwt from 'jsonwebtoken'
import "dotenv/config.js"

export default (req,res,next) => {
    req.token = jwt.sign(
        { mail:req.body.mail },
        process.env.JWT_SECRET,
        { expiresIn:60*60*24 }
    )
    return next()
}
