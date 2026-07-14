const {check}=require("express-validator");
exports.validateInput=[
    check('name')
    .trim()
    .notEmpty()
    .isLength({min:4})
    .withMessage("Name should atleast 4 digits")
    .bail()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters ")
    ,
check("email")
.trim()
.notEmpty()
.isEmail()
.withMessage("Enter Valid Email"),

check("password")
.trim()
.notEmpty()
.isLength({min:6})
.withMessage("Password should atleast 6 digits"),
check("confirmPassword")
.trim()
.custom((value , {req})=>{
    if(value!==req.body.password){
        throw new Error("Password and confirm password missmatch")
    }
    else{
        return true
    }
}),
check('company_code')
.trim()
.notEmpty()
.withMessage("company code cannot be empty"),
check('role')
.trim()
.notEmpty()
.withMessage("Please enter role also")
.bail()
.isIn(['manager' , 'employee'])
.withMessage("Invalid Role")

]