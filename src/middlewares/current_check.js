export default function current_check (req, res, next) {
    if(req.cookies['token']){
        return next()
    }
    return res.sendUserError("No hay ninguna sesión en curso", 404)
}