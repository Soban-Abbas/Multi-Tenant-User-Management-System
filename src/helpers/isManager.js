exports.IsManager = (req, res, next) => {
    if (req.details.role === 'manager') {
        next()
    } else {
        return res.status(401).json({
            error: "Only Manager Can Access this route"
        })
    }
}