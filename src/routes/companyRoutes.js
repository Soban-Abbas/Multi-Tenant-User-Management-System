const express =require("express");
const router=express.Router();
const companyController=require("../controllers/companyController")
const { companyFormValidation }=require("../validators/companyFormValidation")
router.post('/register', companyFormValidation,companyController.registerCompany)
router.post('/login',companyController.loginCompany)

module.exports=router