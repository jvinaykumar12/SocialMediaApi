import mongoose from "mongoose";
import request from "supertest";
import app from "./app.js";
import dotenv from 'dotenv'

dotenv.config()
beforeAll(async () =>{ mongoose.connect(process.env.MONGO)} )
describe("testing all ths api's" ,()=>{

    test("testing all apis at once",async ()=>{ 

        const loginCredentials = await request(app).post("/api/authenticate").send({
            email : "3.com",
            password : 3
        })
        expect(loginCredentials.statusCode).toBe(200)


        const jwt = loginCredentials.body.token
        const anotherUser = await request(app).post('/api/authenticate').send({
            email : "4.com",
            password : 4
        })
        const anotherUserId = anotherUser.body.id



        const testFollow = await request(app).post(`/api/follow/${anotherUserId}`)
                                .set('Authorization',`Bearer ${jwt}`)
        expect(testFollow.statusCode).toBe(200)



        const testUnFollow = await request(app).post(`/api/unfollow/${anotherUserId}`)
                                .set('Authorization',`Bearer ${jwt}`)
        expect(testUnFollow.statusCode).toBe(200)


        const testPost =  await request(app).post(`/api/posts`)
                                .set('Authorization',`Bearer ${jwt}`)
                                .send({
                                    title : "first post",
                                    content : "this is the first post in data"
                                })
        expect(testPost.statusCode).toBe(200)

    
        const postId = testPost.body._id
        const testLikePost = await request(app).post(`/api/like/${postId}`)
                                    .set('Authorization',`Bearer ${jwt}`)       
        expect(testLikePost.statusCode).toBe(200)


        const testUnLikePost = await request(app).post(`/api/unlike/${postId}`)
                                    .set('Authorization',`Bearer ${jwt}`)      
        expect(testUnLikePost.statusCode).toBe(200)

        
        const testPostComment = await request(app).post(`/api/comment/${postId}`)
                                    .set('Authorization',`Bearer ${jwt}`) 
                                    .send({
                                        content : 'this is the first comment'
                                    }) 
        expect(testPostComment.statusCode).toBe(200)  

        const testAllPostsByUser = await request(app).get(`/api/all_posts`)
                                    .set('Authorization',`Bearer ${jwt}`) 
        expect(testAllPostsByUser.statusCode).toBe(200)
        
    })

})


afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()

})