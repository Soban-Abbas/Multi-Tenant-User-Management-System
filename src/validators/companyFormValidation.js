const {check}=require("express-validator")
const {pool}=require("../database/pool")
exports.companyFormValidation=[
    check('name')
    .trim()
    .notEmpty()
    .isLength({max:10})
    .withMessage("company name should be less then 15 letters"),
    check("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid Email")
    .bail()
    .custom(async(value, {req})=>{
        try {
            const companyExist=await pool.query('select * from companies where email=$1',[value]);
            if(companyExist.rowCount>0){
                throw new Error("company already regusterd")
            }else{
                return true
            }
        } catch (error) {
            throw error
        }
    }),
    check("password")
    .trim()
    .notEmpty()
    .isLength({min:5})
    .withMessage("Password should atleast  5 digits"),
    check("confirmPassword")
    .trim()
    .notEmpty()
    .isLength({min:5})
    .withMessage("confirm-password should atleast 5 digits")
    .bail()
    .custom((value,{req})=>{
        if(value===req.body.password){
            return true
        }else{
            throw new Error("Password and confirmPassword mismatch")
        }
    })
    
]