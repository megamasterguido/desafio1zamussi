function register_validator( req, res, next){
    const {first_name, last_name, mail, password} = req.body
    if(!first_name || !last_name || !mail || !password){
        return res.sendUserError("Revise los campos obligatorios: first_name, last_name, mail, password")
    }
    else{
        next()
    }
}

export default register_validator