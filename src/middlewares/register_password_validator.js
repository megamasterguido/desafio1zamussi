function register_password_validator( req, res, next){
    const {password} = req.body
    if(password.length < 8){
        return res.sendUserError("La contraseña debe tener al menos 8 caracteres.")
    }
    else{
        next()
    }
}

export default  register_password_validator