import jwt from 'jsonwebtoken'
import "dotenv/config.js"

export default (req,res,next) => {
    console.log(req.user.mail)
    req.token = jwt.sign(
        { mail:req.user.mail },
        process.env.JWT_SECRET,
        { expiresIn:60*60*24 }
    )
    return next()
}
