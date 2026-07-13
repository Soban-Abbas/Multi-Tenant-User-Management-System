const express =require("express");
const router=express.Router();
const companyController=require("../controllers/companyController")
const { companyFormValidation }=require("../validators/companyFormValidation")
const { validateEmaiandPassword }=require("../validators/companyLoginValidation")
router.post('/register', companyFormValidation,companyController.registerCompany)
router.post('/login',validateEmaiandPassword,companyController.loginCompany)

module.exports=router