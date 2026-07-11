const {pool}=require("../database/pool")
exports.regNewCompany=async(name,email,password)=>{
    try {
        const regNewCompany=pool.query(`insert into companies (name , email , password , total_employees)
            values ($1,$2,$3,$4) returning *`,[name,email,password,0])
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
        throw error
    }
}