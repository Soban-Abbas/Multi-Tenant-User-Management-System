const { pool } = require("../database/pool");
const companiesModel=require("./companyModel")
const bcrypt = require("bcrypt")
exports.regNewEmployee = async (name, email, password, company_code,role) => {
    try {

        const companyExist = await this.getcompanyByCompanyCode(company_code)
        if (companyExist.rowCount < 1) {
            const error= new Error("Wrong Company Code")
            
            error.status = 422
            throw error
        } else {
           
            const hashPassword = await bcrypt.hash(password, 10)
            const newEmployee = await pool.query('insert into employees (name , email, password, company, company_id, role ) values ($1,$2,$3,$4,$5,$6) returning *',[name,email,hashPassword, companyExist.rows[0].name,companyExist.rows[0].id,role]);
            console.log("helo")
            if(newEmployee.rowCount<1){
    
                const error= new Error("Email already registed")
                error.status=422
                throw error
            }else{
                const { password , department,company_id,is_active, ...EmployeeDetails}=newEmployee.rows[0]
             await companiesModel.increaseEmployeeCountByOne(company_id);
                return {
                    message:"Employee register successfully",
                    employeeDetails:{
                             ...EmployeeDetails
                    }
                }
            }
        }

    } catch (error) {
        if(error.code==="23505"){
            error.status=422;
            error.message="Email Already registered"
        }
        throw error
    }
}

exports.getcompanyByCompanyCode = async (company_code) => {
    try {
        
        const company = await pool.query(`select id, name from companies where company_code=$1`, [company_code])
        return company
    } catch (error) {
        throw error
    }
}