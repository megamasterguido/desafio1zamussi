import passport from "passport"
import { userModel } from "../models/user.model.js"

export default function inicializePassport() {
    passport.serializeUser((user,done) => done(null,user._id))
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        return done(null,user)
    })
}
