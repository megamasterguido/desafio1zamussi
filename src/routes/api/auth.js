import {Router} from 'express'
import { userModel } from '../../models/user.model.js'
import register_validator from '../../middlewares/register_auth_validator.js'
import register_password_validator from '../../middlewares/register_password_validator.js'

const router = Router()

router.post(
    '/register',
    register_validator,
    register_password_validator,
    async (req, res) => {
        try{
            let resp = await userModel.create(req.body)
            res.send({
                status: 'Success',
                response: resp
            })
        }
        catch(error){
            res.send({
                status: "Error",
                error: error
            })
        }
    }
)

export default router