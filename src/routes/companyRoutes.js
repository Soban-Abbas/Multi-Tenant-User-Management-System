const express =require("express");
const { verifyToken }=require("../util/verifyToken")
const router=express.Router();
const companyController=require("../controllers/companyController")
const { companyFormValidation }=require("../validators/companyFormValidation")
const { validateEmaiandPassword }=require("../validators/companyLoginValidation")
const { IsCompany }=require("../helpers/isCompany");
const { isCompanyEmployees } = require("../helpers/isCompanyEmployees");
router.post('/register', companyFormValidation,companyController.registerCompany)
router.post('/login',validateEmaiandPassword,companyController.loginCompany)
router.get('/employees', verifyToken, IsCompany, companyController.getEmployeesthrowSearch)
router.put('/recoverAccount',verifyToken,IsCompany,validateEmaiandPassword,companyController.recoverEmployeeAccount)
module.exports=router