import mongoose from "mongoose";
import request from "supertest";
import app from "./index.js";


describe("testing token authentication" ,()=>{
    let response = {};
    test("should return 200 status",async ()=>{ 
        response = await request(app).post("/api/authenticate").send({
            email : "3.com",
            password : 3
        })
        expect(response.statusCode).toBe(200)
    })
    test("should check return json object",async ()=>{
        response = await request(app).post("/api/authenticate").send({
            email : "3.com",
            password : 3
        })
        expect(response.statusCode).toBe(200)
    })

})