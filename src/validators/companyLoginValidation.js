exports.validateEmaiandPassword=(req,res,next)=>{
    const {email,password}=req.body;
        if(!email || !password || !email.includes("@") || password.length<5){
            return res.status(401).json({
                error:"Wrong email or password"
            })
        }else{
        next()
        }
}