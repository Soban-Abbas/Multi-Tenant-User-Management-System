const express=require("express")
require("dotenv").config()
const { startServer }=require("./helpers/startserver")
const app=express();

startServer()
