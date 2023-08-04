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
import inicializePassport from './config/passport.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views',__dirname+'/views')

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(expressSession({
    store: mongoStore.create({
        mongoUrl: process.env.LINK_MONGO,
        ttl: 300
    }),           
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
}))

inicializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', router)
app.use('/public', express.static('public'))

app.use(error_handler)
app.use(not_found_handler)

export default app