export default function current_check (req, res, next) {
    if(req.cookies['token']){
        return next()
    }
    return res.status(404).json({
        success: false,
        response: "No hay ninguna sesión en curso"
    })
}