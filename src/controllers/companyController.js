const {validationResult}=require("express-validator")
const companyModel=require("../models/companyModel")
const bcrypt=require("bcrypt");
exports.registerCompany=async(req , res , next)=>{
    try{
const errors=validationResult(req);
if(!errors.isEmpty()){
   return res.status(422).json({
        error:errors.array()
    })
}
const {name,email,password}=req.body
const encryptedPassword=await bcrypt.hash(password,10)
const regNewCompany=await companyModel.regNewCompany(name,email,encryptedPassword);
if(regNewCompany.rows.length>0){
    const companyDetails={
        id: regNewCompany.rows[0].id,
        name:regNewCompany.rows[0].name,
        email:regNewCompany.rows[0].email,
        Total_employees_registered:regNewCompany.rows[0].total_employees
    }

    res.status(201).json({
        message:"New Company added Successfully",
        companyDetails:companyDetails
    })
}



    } catch (error) {
        next(error)
    }
}

exports.loginCompany=async(req,res,next)=>{
    
}