export default (req, res, next) => {
    if(req.session.role == 1){
        return next()
    }
    return res.status(401).json({
        success: false,
        error: "Usuario no autorizado"
    })
}