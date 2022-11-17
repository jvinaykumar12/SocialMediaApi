import mongoose from "mongoose";
console.log("in userMode")

const schema = mongoose.Schema({
    name:{
        type:String,
    },
    password:{
        type:String,
    },
    email:{
        type:String,
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }
},{timestamps:true})


export default mongoose.model("users",schema)