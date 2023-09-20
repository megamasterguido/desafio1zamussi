import config from '.././config.js'
import { Strategy } from 'passport-local'
import GHStrategy from 'passport-github2'
import passport from 'passport'
import jwt from 'passport-jwt'
import authDaoMongo from '../dao/Mongo/classes/authDao.js'
import userController from '../controllers/user.controller.js'

const authDao = new authDaoMongo()
const JWTStrategy = jwt.Strategy

export default function(){
    passport.serializeUser(
        (user, done) => done(null, user._id)
    )

    passport.deserializeUser(
        async(id, done) => {
            const user = await userController.getUser(id)
            return done(null, user)
        }
    )

    passport.use(
        'jwt',
        new JWTStrategy({
            jwtFromRequest: jwt.ExtractJwt.fromExtractors([(req) => req?.cookies['token']]),
            secretOrKey: config.jwt
        },
        async (jwt_playload, done) => {
            try{
                let user = await userController.signIn(jwt_playload.mail)
                if(user){
                    delete user.password
                    return done(null, user)
                }
                return done(null, false, {message: 'Error de autenticación de token'})
            }
            catch(err){
                return done(err,false)
            }
        })
    )

    passport.use(
        'current',
        new JWTStrategy({
            jwtFromRequest: jwt.ExtractJwt.fromExtractors([(req) => req?.cookies['token']]),
            secretOrKey: config.jwt
        },
        async (jwt_playload, done) => {
            try{
                let user = await userController.signIn(jwt_playload.mail)
                if(user){
                    return done(null, user)
                }
                return done(null, false, {message: 'No hay ninguna sesión en curso'})
            }
            catch(err){
                return done(err,false)
            }
        })
    )

    passport.use(
        'register',
        new Strategy(
            { passReqToCallback:true,usernameField:'mail' },
            async (req,userName,password,done) => {
                try {
                    let one = await userController.signIn(userName)
                    if (!one) {
                        let user = await userController.addUser(req.body)
                        return done(null,user)
                    }
                    return done(null,false, {message: "El correo ingresado ya pertenece a un usuario existente."})
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    
    passport.use(
        'login',
        new Strategy(
            { usernameField:'mail' },
            async (username,password,done) => {
                try {
                    let one = await userController.signIn(username)
                    if (one) {
                        return done(null,one)
                    }
                    return done(null,false)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    
    passport.use(
        'github',
        new GHStrategy(
            { clientID: config.github_client,clientSecret:config.github,callbackURL:config.github_callback },
            async (accessToken,refreshToken,profile,done) => {
                try {
                    let one = await userController.signIn(profile._json.login)
                    if (!one) {
                        let user = await userController.addUser({
                            first_name:profile._json.name,
                            last_name:"from Github",
                            mail:profile._json.login,
                            photo:profile._json.avatar_url,
                            password:profile._json.id
                        })
                        return done(null,user)	//si no lo encuentra lo crea y envía
                    }
                    return done(null,one)		//si encuentra el usuario lo envía
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

}