function register_password_validator( req, res, next){
    const {password} = req.body
    if(password.length < 8){
        res.send({
            status: "error",
            error: "La contraseña debe tener al menos 8 caracteres."
        })
    }
}

export default  register_password_validator