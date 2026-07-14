exports.isCompanyEmployees=(req , res , next)=>{
    if (req.details.role === 'employee' || req.details.role==='manager') {
        next()
    } else {
        return res.status(401).json({
            error: "Only Employees Can Access this route"
        })
    }
}