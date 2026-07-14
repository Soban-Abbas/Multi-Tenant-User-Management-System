const {pool}=require("../database/pool")
exports.is_active=async(req , res , next)=>{
   try {
    const is_active=await pool.query(`select * from employees where id = $1` ,[req.details.id])
if(is_active.rows[0].is_active===false){
   return res.status(401).json({
        error:"user not found"
    })
}
next()
   } catch (error) {
    next(error)
   }
}