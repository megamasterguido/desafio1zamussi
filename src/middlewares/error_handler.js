const errorHandler = (error, req, res, next) => {
    console.error(error.stack)
    return res.sendServerError({
        method: req.method,
        path: req.url,
        response: error.message})
}

export default errorHandler
