const jwt = require("jsonwebtoken");
const { UserModel } = require("../database/db");
const JWT_SECRET = "randomString"

async function auth(req, res, next) {
    try {
        const token = req.headers.token;
        if(!token) return res.json({msg : "token null , sign in again"});
        const JWT_SECRET = require("./../backend/server");
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
        res.status(400).json({
            msg : "error occurred",
            error : e
        })
    }
}
module.exports = auth;