const { pool } = require("../database/pool");
const companiesModel=require("./companyModel")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const { generateToken }=require("../util/generateJWT")
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


exports.getEmployeeByEmail=async(email)=>{
    try {
        const employee=await pool.query(`select * from employees where email = $1 `,[email])
        if(employee.rowCount>0){
            return employee.rows[0]
        }else{
            const error = new Error("Invalid email or password")
            error.status=401
            throw error
            return
        }
    } catch (error) {
        throw error
    }
}

exports.checklogin=async(email,password)=>{
    try {
        const employee=await this.getEmployeeByEmail(email);
        if(employee.is_active===false){
            const error=new Error("To login your profile please contact youe company")
            error.status=404;
            throw error;
            return
        }
        const correctPassword=await bcrypt.compare(password,employee.password);
        if(!correctPassword){
            const error = new Error("Wrong Email or password");
            error.status=401;
            throw error
            return
        }else{
const token = generateToken(employee.id,employee.email,employee.role)
const {password,department,is_active,company_id,...employeeDetails}=employee
return{
...employeeDetails,
token
}
        }
    } catch (error) {
        throw error
    }
}


exports.softDelete=async(email,password)=>{
    try {
        const employee= await this.getEmployeeByEmail(email);
        if(employee.is_active===false){
            const error=new Error("User not Found ");
            error.status=404
            throw error;

        }
        const correctPassword= await bcrypt.compare(password,employee.password)
        if(!correctPassword){
            const error = new Error("Wrong Email or password")
            error.status = 401;
            throw error
            return
        }
const updateEmployeeDetails=await pool.query("update employees set is_active = false where email=$1",[email]);

return {
    message:"Employee deleted Successfully"
}


    } catch (error) {
        throw error
    }
}


exports.verifyEmailAndPassword=async(email,password)=>{
try {
    const employee=await this.getEmployeeByEmail(email);
    const correctPassword=await bcrypt.compare(password,employee.password);
    if(!correctPassword){
        const error=new Error("Wrong email or password")
        error.status=401
        throw error
    }
    return {
        message :"Login cradentials are correct",
        ...employee
    }
} catch (error) {
    throw error
}
}