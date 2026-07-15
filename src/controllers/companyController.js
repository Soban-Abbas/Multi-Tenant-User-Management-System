const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt");
const companyModel = require("../models/companyModel")
const { generateToken } = require("../util/generateJWT")

exports.registerCompany = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()
            })
        }
        const { name, email, password } = req.body
        const encryptedPassword = await bcrypt.hash(password, 10)
        const regNewCompany = await companyModel.regNewCompany(name, email, encryptedPassword);
        if (regNewCompany.rows.length > 0) {
            const companyDetails = {
                id: regNewCompany.rows[0].id,
                name: regNewCompany.rows[0].name,
                email: regNewCompany.rows[0].email,
                total_employees_registered: regNewCompany.rows[0].total_employees,
                company_code: regNewCompany.rows[0].company_code
            }

            return res.status(201).json({
                message: "New Company added Successfully",
                companyDetails: companyDetails
            })
        } else {
            return res.status(400).json({
                error: "Registration Failed! "
            })
        }



    } catch (error) {
        next(error)
    }
}

exports.loginCompany = async (req, res, next) => {
    try {

        const { email, password } = req.body

        const companyExist = await companyModel.findCompanyByEmail(email)
        const correctPassword = await bcrypt.compare(password, companyExist.password)
        if (!correctPassword) {
            return res.status(401).json({
                error: "Wrong Email or password"
            })
        }

        const token = generateToken(companyExist.id, companyExist.email, "company")
        const { id, name, email: company_email, company_code, total_employees } = companyExist
        res.status(200).json({
            message: "Company Login Successfull",
            companyData: {
                id,
                name,
                company_email,
                company_code,
                total_employees,
                token
            }
        })

    } catch (error) {
        next(error)
    }
}

exports.getEmployeesthrowSearch = async (req, res, next) => {
    try {
        const name = req.query.name || "";

        const employees = await companyModel.getAllEmployeesthroughSearch(req.details.id, name)

        if (employees.rowCount > 0) {

            return res.status(200).json({
                data: employees.rows
            })
        } else {
            return res.status(404).json({
                error: "No match found"
            })
        }
    } catch (error) {
        next(error)
    }


}
exports.recoverEmployeeAccount = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { id: company_id } = req.details
        const activateAccount = await companyModel.recoverEmployeeAccount(company_id, email, password)
        res.status(200).json({
            message: "Employee Account Activated Successfully",
            ...activateAccount
        })
    } catch (error) {
        next(error)
    }


}

exports.filterEmployees = async (req, res, next) => {
try {
    let active = req.query.active || true;
    let {page,limit}=req.query
    page=Number(page);
    limit=Number(limit)
const offset=(page-1)*limit;
    if (active === true || active === "true" ) {
const activeEmployees=await companyModel.filterEmployees(req.details.id,true,limit,offset)
if(activeEmployees.rowCount<1){
    return res.status(404).json({
        error:"NO  Employee is Active "
    })
}else{
return res.status(200).json({
    message:"Active Employees",
    activeEmployees:activeEmployees.rows
})
}
    }else{
        const inactiveEmployees=await companyModel.filterEmployees(req.details.id,false,limit,offset);
        if (inactiveEmployees.rowCount < 1) {
            return res.status(404).json({
                error: "NO  Employee is InActive "
            })
        } else {
            return res.status(200).json({
                message: "Active Employees",
                activeEmployees: inactiveEmployees.rows
            })
        }
    }
} catch (error) {
    next(error)
}
   

}


exports.getAllEmployeesPagination=async(req,res,next)=>{
    try {
        const {page,limit}=req.query
        const company_id=req.details.id;
        const offset=(Number(page)-1)*limit;

        const employees=await companyModel.getAllEmployees(company_id,limit,offset)
        if(employees.rowCount<1){
            return res.status(404).json({
                error:" employee  not found"
            })
        }else{
            res.status(200).json({
                message:"Employees fetch successfully",
               employees: employees.rows
            })
        }
    } catch (error) {
        next(error)
    }
}