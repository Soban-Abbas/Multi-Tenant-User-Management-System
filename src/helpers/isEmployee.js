exports.IsEmployee = (req, res, next) => {
    if (req.details.role === 'employee') {
        next()
    } else {
        return res.status(401).json({
            error: "Only Employees Can Access this route"
        })
    }
}