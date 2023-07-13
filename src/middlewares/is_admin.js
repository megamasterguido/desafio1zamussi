export default (req, res, next) => {
    if(req.session.role == 1){
        return next()
    }
    return res.json({
        status: 'error',
        error: "Usuario no autorizado"
    })
}