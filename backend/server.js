const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://shashwatniranjan1_db_user:QcvIkzKSBWuUPbVS@cluster0.6afomns.mongodb.net/todo-shashwat");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "randomString";
const {UserModel, TodoModel} = require("../database/db");
app.use(express.json());
const {z} = require("zod");
const bcrypt = require("bcrypt")
const auth = require("./../Auth/auth");

app.post("/signup", async function(req, res) {
    const requiredBody = z.object({
        email : z.email().min(5).max(100),
        password : z.string().min(5).max(100)
    })
    try {
        const parsedDataWithSuccess = requiredBody.safeParse(req.body, {strict : true});
        if(!parsedDataWithSuccess.success) {
            console.log(parsedDataWithSuccess.error.message)
            res.json({msg : "incorrect format", error : parsedDataWithSuccess.error.message});
            return;
        }else {
            const {email, password} = parsedDataWithSuccess.data;
            const foundUser = await UserModel.findOne({
                email
            })
            if(foundUser) return res.json({msg : "user already exist"});
            const hashedPassword = await bcrypt.hash(password, 10); //manages salting itself
            await UserModel.create({
                email : email,
                password : hashedPassword
            })
            res.json({msg : "Signed up"})
        }
    }catch(e) {
        console.log(e);
        res.json({
            msg : "Incorrect format",
            error : e.message
        })
    }
})

app.post("/signin", async function(req, res) {
    const requiredBody = z.object({
        email : z.email().min(5).max(100),
        password : z.string().min(5).max(100)
    })
    try {
        const parsedDataWithSuccess = requiredBody.safeParse(req.body, {strict : true});
        if(!parsedDataWithSuccess.success) {
            res.json({msg : "incorrect format", error : parsedDataWithSuccess.error});
            return;
        }else {
        const {email , password} = parsedDataWithSuccess.data;
           const response = await UserModel.findOne({
            email : email
           })
           if(!response) return res.status(400).json({msg : "User doesn't exist"});
           const isCorrect = await bcrypt.compare(password, response.password);
           if(isCorrect) {
            const token = jwt.sign({
                userId : response._id
            }, JWT_SECRET)
            res.json({
                msg : "signed in",
                token : token
            })
           } else {
            res.status(400).json({msg : "invalid credentials"});
            return
           }
        }
    } catch(e) {
        res.json({
            msg : "Error occurred",
            error : e
        })
    }
})

app.post("/todo", auth, async function(req, res) {
    
})

app.listen(3000, () => {
    console.log("server running on port 3000")
})