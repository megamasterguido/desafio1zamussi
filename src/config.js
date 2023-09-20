import dotnev from 'dotenv'
import program from './process.js'

let environment = program.opts().mode

dotnev.config({
    path: environment === "PRODUCTION"? './.env.production' : './.env.development' 
})


export default {
    port: process.env.PORT,
    link_mongo: process.env.LINK_MONGO,
    session: process.env.SECRET_SESSION,
    jwt: process.env.JWT_SECRET,
    cookie: process.env.COOKIE_SECRET,
    github_app: process.env.GH_APP_ID,
    github_client: process.env.GH_CLIENT,
    github: process.env.GH_SECRET,
    github_callback: process.env.githubCb
}