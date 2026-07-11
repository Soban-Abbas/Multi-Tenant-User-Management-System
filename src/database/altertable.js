const {pool}=require("./pool");
exports.alterCompaniesTable=async()=>{
    try {
        pool.query(`ALTER TABLE IF EXISTS companies
    ADD COLUMN company_code character varying(20) NOT NULL unique;`)
    } catch (error) {
        console.log(error)
    }
}