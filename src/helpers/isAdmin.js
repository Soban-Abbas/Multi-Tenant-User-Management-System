exports.IsAdmin = (req, res, next) => {
    if (req.details.role === 'admin') {
        next()
    } else {
        return res.status(401).json({
            error: "Only admin Can Access this route"
        })
    }
}