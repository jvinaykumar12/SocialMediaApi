import mongoose, { Schema } from "mongoose";

const schema  = mongoose.Schema({

    postId : {
        type : String
    },
    ownerId : {
        type : String
    },
    content : {
        type : String
    }
},{timestamps:true})

export default mongoose.model('comments',schema)