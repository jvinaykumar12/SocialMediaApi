import app from "./app.js";
import dotenv from "dotenv"
import mongoose from 'mongoose'

dotenv.config()
const port = process.env.PORT || 3000
mongoose.connect('mongodb://localhost:27017/reunion',()=>{console.log("ok")})
app.listen(port)