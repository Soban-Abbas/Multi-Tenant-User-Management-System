const jwt=require("jsonwebtoken")
exports.verifyToken=(req,res , next)=>{

    const authheader = req.headers['authorization'] || req.headers['Authorization'];
    if(!authheader){
       return res.status(401).json({
            error:"Please Login First"
        })
    }

    const token=authheader.split(" ")[1];
    if(!token){
    return res.status(401).json({
        error:"Please Login First"
    })
}

    const decode = jwt.verify(token, process.env.jwtKey);
    req.details=decode
      next()
}