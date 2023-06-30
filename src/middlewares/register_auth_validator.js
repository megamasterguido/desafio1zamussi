function register_validator( req, res, next){
    const {name, mail, password} = req.body
    if(!name || !mail || !password){
        return res.json({
            status: "error",
            error: "Revise los campos obligatorios: name, mail, password"
        })
    }
    else{
        next()
    }
}

export default register_validator