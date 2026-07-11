const {pool}=require("../database/pool")
const crypto=require("crypto");
exports.regNewCompany=async(name,email,password)=>{
    try {
           const company_code = crypto.randomBytes(4).toString('hex');
        const regNewCompany=pool.query(`insert into companies (name , email , password , total_employees, company_code )
            values ($1,$2,$3,$4,$5) returning *`,[name,email,password,0,company_code])
            return regNewCompany
    } catch (error) {
        next(error)
    }
}
exports.findCompanyByEmail=async(email)=>{
    try {
        const companyExist=await pool.query('select * from companies where email=$1 ',[email])
        if(companyExist.rowCount>0){
            return companyExist.rows[0]
        }else{
            throw new Error("wrong Email or password")
        }
    } catch (error) {
        error.status=401
        throw error
    }
}