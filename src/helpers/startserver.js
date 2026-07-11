
const { createTables }=require("../database/tablesCreation")
const { alterCompaniesTable }=require("../database/altertable")
exports.startServer=async(app)=>{
try {
    await createTables();
   // await alterCompaniesTable();
    app.listen(3000,()=>{
        console.log("server is successfully started ")
    })
} catch (error) {
    console.log(error)
}
}