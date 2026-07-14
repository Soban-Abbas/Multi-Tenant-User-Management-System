const express=require("express");
const router=express.Router();
const employeeController=require("../controllers/employeeController")
const { validateInput }=require("../validators/employeeFormValidation")
const { verifyToken }=require("../util/verifyToken")
const { isCompanyEmployees }=require("../helpers/isCompanyEmployees")
const { validateEmaiandPassword }=require("../validators/companyLoginValidation")
router.post("/register", validateInput,employeeController.registerEmployee)
router.post("/login", validateEmaiandPassword,employeeController.login)
router.post('/delete', verifyToken, validateEmaiandPassword,isCompanyEmployees,employeeController.deleteEmployee)
module.exports=router