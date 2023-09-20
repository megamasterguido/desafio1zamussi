import passport from "passport";

export default (strategy)=> {
    return async(req,res,next)=> {
        passport.authenticate(
            strategy,
            (err,user,info)=> {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    return res.sendUserError(info.message ? info.message : info.toString(),401)
                }
                req.user = user
                return next()
            }
        )(req,res,next)
    }
}
