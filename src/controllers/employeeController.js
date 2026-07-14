const { validationResult } = require("express-validator")
const EmployeeModel = require("../models/employeeModel")
exports.registerEmployee = async (req, res, next) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                error: error.array()
            })
        }
        const { name, email, password, company_code , role} = req.body
        const registeredEmployee = await EmployeeModel.regNewEmployee(name, email, password, company_code, role)
        res.status(201).json({
            ...registeredEmployee
        })

    } catch (error) {
        next(error)
    }
}
exports.login=async(req , res , next)=>{
    try {
        
        const {email,password}=req.body;
        const details= await EmployeeModel.checklogin(email,password)
     return   res.status(200).json({
          ...details
        })
    } catch (error) {
        next(error)
    }
}
exports.deleteEmployee=async(req,res,next)=>{
    try {
        const softDelete = await EmployeeModel.softDelete(req.body.email,req.body.password)
        res.status(200).json({
           ... softDelete
        })
    } catch (error) {
        next(error)
    }
}
