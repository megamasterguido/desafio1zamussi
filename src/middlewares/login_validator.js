function login_validator(req, res, next){
    
    let {mail, password} = req.body
    if(!mail || !password){
        return res.sendUserError("Complete ambos campos para proseguir")
    }
    else{
        next()
    }
}

export default login_validator