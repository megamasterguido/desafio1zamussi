export default (req, res, next) => {
    if(req.session.role == 1){
        return next()
    }
    return res.sendUserError("Usuario no autorizado", 401)
}