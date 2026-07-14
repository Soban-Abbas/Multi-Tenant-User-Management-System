const express=require("express");
const router=express.Router();
const employeeController=require("../controllers/employeeController")
const { validateInput }=require("../validators/employeeFormValidation")
const { validateEmaiandPassword }=require("../validators/companyLoginValidation")
router.post("/register", validateInput,employeeController.registerEmployee)
router.post("/login", validateEmaiandPassword,employeeController.login)
module.exports=router