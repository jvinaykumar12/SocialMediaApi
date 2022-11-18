import app from "./app.js";
import dotenv from "dotenv"
import mongoose from 'mongoose'

dotenv.config()
const port = process.env.PORT || 3000
mongoose.connect(process.env.MONGO,()=>{console.log("connected mongodb")})
app.get('/',(req,res)=>{
    res.send("Nodejs server is working")
})
app.listen(port)