const {Pool}=require("pg")
exports.pool=new Pool({
    database:process.env.database,
    user: process.env.user,
    password: process.env.password,
    port:process.env.port,
    host:process.env.host
})
