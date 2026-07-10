const express=require("express");
const app=express()
const { createTables }=require("../database/tablesCreation")
exports.startServer=async()=>{
try {
    await createTables();
    app.listen(3000,()=>{
        console.log("server is successfully started ")
    })
} catch (error) {
    console.log(error)
}
}