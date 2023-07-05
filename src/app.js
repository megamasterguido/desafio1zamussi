import express from 'express'
import router from './routes/index.js'
import error_handler from './middlewares/error_handler.js'
import not_found_handler from './middlewares/not_found_handler.js'
import { engine } from 'express-handlebars'
import { __dirname } from './utils.js'
import cookieParser from 'cookie-parser'
import expressSession from "express-session"
import mongoStore from 'connect-mongo'
import 'dotenv/config.js'
import morgan from 'morgan'
import passport from 'passport'
import inicializePassport from './middlewares/initializePassport.js'
import { userModel } from './models/user.model.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views',__dirname+'/views')

app.use(cookieParser())
app.use(expressSession({
    store: mongoStore.create({
        mongoUrl: process.env.LINK_MONGO,
        ttl: 300
    }),           
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}))

inicializePassport()
app.use(passport.initialize())
app.use(passport.session())

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
        { clientID:GH_CLIENT,clientSecret:GH_SECRET,callbackURL:githubCb },
        async (accessToken,refreshToken,profile,done) => {
            try {
                console.log(profile)
                let one = await userModel.findOne({ mail:profile._json.login })
                if (!one) {
                    let user = await userModel.create({
                        name:profile._json.name,
                        mail:profile._json.login,
                        age:18,
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


app.use('/', router)
app.use('/public', express.static('public'))

app.use(error_handler)
app.use(not_found_handler)

export default app