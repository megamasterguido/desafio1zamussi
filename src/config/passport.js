import 'dotenv/config.js'
import { Strategy } from 'passport-local'
import GHStrategy from 'passport-github2'
import passport from 'passport'
import { userModel } from '../models/user.model.js'
import jwt from 'passport-jwt'


const JWTStrategy = jwt.Strategy

export default function(){
    passport.serializeUser(
        (user, done) => done(null, user._id)
    )

    passport.deserializeUser(
        async(id, done) => {
            const user = await userModel.findById(id)
            return done(null, user)
        }
    )

    passport.use(
        'jwt',
        new JWTStrategy({
            jwtFromRequest: jwt.ExtractJwt.fromExtractors([(req) => req?.cookies['token']]),
            secretOrKey: process.env.JWT_SECRET
        },
        async (jwt_playload, done) => {
            try{
                let user = await userModel.findOne({mail: jwt_playload.mail})
                if(user){
                    delete user.password
                    return done(null, user)
                }
                return done(null, false, {message: 'not auth'})
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
                    let one = await User.findOne({ mail:userName })
                    if (!one) {
                        let user = await userModel.create(req.body)
                        return done(null,user)
                    }
                    return done(null,false)
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
                    let one = await userModel.findOne({ mail:username })
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
            { clientID: process.env.GH_CLIENT,clientSecret:process.env.GH_SECRET,callbackURL:process.env.githubCb },
            async (accessToken,refreshToken,profile,done) => {
                try {
                    let one = await userModel.findOne({ mail:profile._json.login })
                    if (!one) {
                        let user = await userModel.create({
                            name:profile._json.name,
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