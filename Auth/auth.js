const jwt = require("jsonwebtoken");
const { UserModel } = require("../database/db");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
async function auth(req, res, next) {
    try {
        const token = req.headers.token;
        if(!token) return res.json({msg : "token null , sign in again"});
        const decodetoken = jwt.verify(token, JWT_SECRET);
        const foundUser = await UserModel.findOne({
            _id : decodetoken.userId
        })
        if(!foundUser) {
            return res.json({msg : "token invalid, sign in again"});
        }
        req.userId = foundUser._id;
        next();
    }catch(e) {
        if(e.name === "JsonWebTokenError"){
            return res.status(403).json({
                msg : "Invalid Token"
            })
        }else if(e.name === "TokenExpiredError"){
            return res.status(403).json({
                msg : "Token expired"
            })
        }
        console.log("Auth middleware error", e);
        res.status(500).json({
            msg : "Internal server error"
        })
    }
}
module.exports = auth;