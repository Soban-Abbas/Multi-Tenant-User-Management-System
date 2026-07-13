const jwt=require("jsonwebtoken");

exports.generateToken=(id , email )=>{
    const payload={
        id:id,
        email:email
    }
    const secretKey=process.env.jwtKey
    const expiry={
        expiresIn:"1h"
    }

   const token= jwt.sign(payload,secretKey,expiry)

   return token
}