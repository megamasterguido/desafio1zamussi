import register_validator from '../../middlewares/register_auth_validator.js'
import register_password_validator from '../../middlewares/register_password_validator.js'
import login_validator from '../../middlewares/login_validator.js'
import createHash from '../../middlewares/createHash.js'
import isValidPassword from '../../middlewares/isValidPassword.js'
import passport from 'passport'
import jwt_generate from '../../middlewares/jwt_generate.js'
import passport_call from '../../middlewares/passport_call.js'
import current_check from '../../middlewares/current_check.js'
import CustomRouter from '../router.js'
import userController from '../../controllers/user.controller.js'

class UserRouter extends CustomRouter{
    init(){
        this.post(
            '/register',
            [],
            register_validator,
            register_password_validator,
            createHash,
            passport_call('register'),
            jwt_generate,
            userController.register
        )
    
        this.post(
            '/login',
            [],
            login_validator,
            register_password_validator,
            passport.authenticate('login',{}),
            isValidPassword,
            jwt_generate,
            userController.login
        )
    
        this.post(
            '/logout',
            [],
            userController.logout
        )
    
        this.get(
            '/',
            [],
            async (req, res) => {
                try{
                    let resp = {
                        usuario: req.user || "Nada",
                        session: req.session || "Nada"
                    }
                    return res.sendSuccess(resp)
                }
                catch(error){
                    return res.sendServerError(error)
                }
            }
        )
    
        this.get('/github',
            [],
            passport.authenticate('github',{ scope:['user:email'] }),
            userController.github
        )
    
        this.get(
            '/github/callback', //endpoint
            [],    
            passport.authenticate('github',{ failureRedirect:'/api/auth/fail-register-github' }),   //middleware con estrategia de auth de github
            jwt_generate,
            userController.githubCallBack
        )
    
        this.get('/fail-register-github',
            [],    
            userController.githubFail
            )
    
    
        this.get(
            '/current',
            [],    
            current_check,
            passport_call('current'),
            userController.current
        )
    }
}

export default new UserRouter()