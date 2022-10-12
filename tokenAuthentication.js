import jwt from "jsonwebtoken";

const SECRET_KEY = 'thisisarandomkeyusedforjwttokengeneration'
export default function tokenAuthentication(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token) return res.status(403).send("not authorized")

    jwt.verify(token,SECRET_KEY,(error, user)=>{
        if(error) return res.sendStatus(403)
        req.user = user
    })
    next()
}