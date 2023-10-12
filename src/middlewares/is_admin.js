export default (req, res, next) => {
    if(req.user.role == 'admin'){
        return next()
    }
    return res.status(401).json({success:false, error:"Usuario no autorizado"})
}