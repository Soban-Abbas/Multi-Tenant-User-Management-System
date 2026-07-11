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