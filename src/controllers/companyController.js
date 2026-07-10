const {validationResult}=require("express-validator")
exports.registerCompany=async(req , res , next)=>{
    try{
const errors=validationResult(req);
if(!errors.isEmpty()){
   return res.status(422).json({
        error:errors.array()
    })
}



    } catch (error) {
        next(error)
    }
}