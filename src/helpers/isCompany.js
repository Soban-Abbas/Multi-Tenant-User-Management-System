exports.IsCompany = (req, res, next) => {
    if (req.details.role === 'company') {
        next()
    } else {
        return res.status(401).json({
            error: "Only company Can Access this route"
        })
    }
}