import passport from "passport"
import { Strategy } from 'passport-local'
import User from "../models/User.js"

export default function inicializePassport() {
    passport.serializeUser((user,done) => done(null,user._id))
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        return done(null,user)
    })
}
