import { userModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import "dotenv/config.js"

export default (req, res, next) => {
    const auth = req.headers.authorization
    if (!auth) {
        return res.status(401).json({
            success: false,
            error: 'error de autorización!'
        })
    }
    const token = auth.split(' ')[1]
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        async(error,credentials) => {
            if(error) {
                return res.json({
                    success: false,
                    error: 'error de autorización!'
                })
            }
            let user = await userModel.findOne({ mail:credentials.mail })
            req.user = user
            return next()
        }
    )
}
