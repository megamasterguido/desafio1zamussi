function register_validator( req, res, next){
    const {name, mail, password} = req.body
    if(!name || !mail || !password){
        res.send({
            status: "error",
            error: "Revise los campos obligatorios: name, mail, password"
        })
    }
}

export default register_validator