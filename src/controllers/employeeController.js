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
