function register_validator( req, res, next){
    const {first_name, last_name, mail, password} = req.body
    if(!first_name || !last_name || !mail || !password){
        return res.status(400).json({
            success: false,
            error: "Revise los campos obligatorios: first_name, last_name, mail, password"
        })
    }
    else{
        next()
    }
}

export default register_validator