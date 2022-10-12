import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import jwt from "jsonwebtoken";
import postModel from "./postModel.js";
import userModel from "./userModel.js";
import tokenAuthentication from "./tokenAuthentication.js";
import commentModel from "./commentModel.js";

const app = express()
dotenv.config()
app.use(cors({
    origin:'*'
}))

app.use(express.json())

app.post('/api/authenticate',async (req,res)=>{

    try{
        const user = await userModel.findOne({email:req.body.email})
        if(user) {
            const temp = {
                id:user._id,
                email:user.email
            }
            const accessToken = jwt.sign(temp,process.env.SECRET_KEY)
            res.status(200).json({
                token:accessToken,
                userDetails:user
            })
        }
        else {
            const newUser = new userModel(req.body)
            await newUser.save()
            const temp = {
                id: newUser._id,
                email: newUser.email
            }
            const accessToken = jwt.sign(temp,process.env.SECRET_KEY)
            res.status(200).json({
                token:accessToken,
                userDetails:newUser
            })
        }
    }

    catch(e) {
        res.status(403).json({
            isError:true,
            error:e.message
        })
    }   

})

app.post('/api/follow/:id',tokenAuthentication,async (req,res)=>{
    try{
        const otherUser = await userModel.findById(req.params.id)
        if(!otherUser) return res.send('user Not Found')
        const currentUser = await userModel.findOne({email:req.user.email})
        if(!otherUser.followers.includes(currentUser.id)) {
            await currentUser.updateOne({$push:{following:otherUser._id}})
            await otherUser.updateOne({$push:{followers:currentUser._id}})
            res.send("succesfully followed")
        }
        else{
            res.send("already following")
        }
    }
    catch(e){
        return res.send(e.message)
    }   
})

app.post('/api/unfollow/:id',tokenAuthentication,async (req,res)=>{
    try{
        const otherUser = await userModel.findById(req.params.id)
        if(!otherUser) return res.send('user Not Found')
        const currentUser = await userModel.findOne({email:req.user.email})
        if(otherUser.followers.includes(currentUser.id)) {
            await currentUser.updateOne({$pull:{following:otherUser._id}})
            await otherUser.updateOne({$pull:{followers:currentUser._id}})
            res.send("succesfully unfollowed")
        }
        else{
            res.send("You are not following this user")
        }
    }
    catch(e){
        return res.send(e.message)
    }   
})


app.get('/api/user',tokenAuthentication, async(req,res)=>{
    try {
        const user = await userModel.findOne({email:req.user.email})
        res.status(200).send(user)
    } catch (e) {
        res.send(403).send(e)
    }
})


app.post('/api/posts',tokenAuthentication,async(req,res)=>{
    try {

        const post = new postModel({
            ownerId : req.user.id,
            title : req.body.title,
            content : req.body.content,
            description : req.body.description
        })

        const output = await post.save()
        res.status(200).send(output)
    }
    catch(e) {
        res.status(403).json(e)
    }
})

app.delete('/api/delete/:id',tokenAuthentication, async(req,res)=>{
    try {
        const post = await postModel.findById(req.params.id)
        if(!post) {
            return res.status(404).send('post not found')
        }
        else if(post.ownerId != req.user.id){
            return res.status(403).send('You are not the owner of this post')
        }
        await postModel.deleteOne({_id:req.params.id})
        res.status(200).send("successfully deleted")

    }
    catch(e) {
        res.status(503).send(e)
    }
})

app.post('/api/like/:id',tokenAuthentication, async(req,res)=>{
    try {
        const post = await postModel.findById(req.params.id)
        if(!post) {
            return res.status(404).send('post not found')
        }
        await post.updateOne({$push:{likes:req.user.id}})
        res.status(200).send("liked the post successfully")
    }

    catch(e) {
        res.status(503).send(e)
    }
})

app.post('/api/unlike/:id',tokenAuthentication, async(req,res)=>{
    try {
        const post = await postModel.findById(req.params.id)
        if(!post) {
            return res.status(404).send('post not found')
        }
        await post.updateOne({$pull:{likes:req.user.id}})
        res.status(200).send("unliked the post successfully")
    }

    catch(e) {
        res.send(503).send(e)
    }
})

app.post('/api/comment/:id',tokenAuthentication, async(req,res)=>{
    try {
        const comment = new commentModel({
            postId : req.params.id,
            ownerId : req.user.id,
            content : req.body.content
        })
        await comment.save()
        const post = await postModel.findById(req.params.id)
        if(post) {
            await post.updateOne({$push:{comments : comment}})
            return res.status(200).json(comment)
        }
        else {
            return res.status(403).send("post not found")
        }
        
    }

    catch(e) {
        console.log(e)
        res.status(503).send(e)
    }
})

app.get('/api/all_posts',tokenAuthentication,async(req,res)=>{
    try {
        const allPost = await postModel.find({ownerId : req.user.id})
        res.status(200).send(allPost)
    }
    catch(e) {
        res.status(503)
    }
})

export default app