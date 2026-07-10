const express=require("express")
require("dotenv").config()
const { startServer }=require("./helpers/startserver")
const companyRoutes=require('./routes/companyRoutes')
const bodyParser=require("body-parser")
const app=express();
app.use(bodyParser.json())

app.use('/company',companyRoutes)
startServer(app)
