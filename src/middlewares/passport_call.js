import passport from "passport";

export default (strategy)=> {
    return async(req,res,next)=> {
        passport.authenticate(
            strategy,
            (err,user,info)=> {
                console.log({err,user,info});
                if (err) {
                    return next(err)
                }
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        error: info.message ? info.message : info.toString()
                    })
                }
                req.user = user
                return next()
            }
        )(req,res,next)
    }
}
