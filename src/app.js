const express=require("express")
require("dotenv").config()
const { startServer }=require("./helpers/startserver")
const companyRoutes=require('./routes/companyRoutes')
const { globalErrorHandlingMiddleware }=require("./middlewares/globalErrorHandlingMiddleware")
const bodyParser=require("body-parser")
const app=express();
app.use(bodyParser.json())

app.use('/company',companyRoutes)


app.use(globalErrorHandlingMiddleware);
startServer(app)
