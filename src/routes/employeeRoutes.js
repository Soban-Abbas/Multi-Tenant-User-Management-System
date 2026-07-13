const express=require("express");
const router=express.Router();
const employeeController=require("../controllers/employeeController")
const { validateInput }=require("../validators/employeeFormValidation")
router.post("/register", validateInput,employeeController.registerEmployee)

module.exports=router