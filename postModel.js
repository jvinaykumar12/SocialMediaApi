import mongoose from "mongoose";

const schema = mongoose.Schema({

    ownerId:{
        type:String
    },
    title:{
        type:String
    },
    content :{
        type:String
    },
    description:{
        type:String
    },
    comments:{
        type:Array,
        default:[]
    },
    likes:{
        type:Array,
        default:[]
    },
    unlikes:{
        type:Array,
        default:[]
    }
    
},{timestamps:true})

export default mongoose.model("posts",schema)