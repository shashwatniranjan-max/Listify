const {UserModel} = require("../db/db");

async function auth(req, res, next) {
    try {
        const token = req.headers.token;
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodeToken) return res.status(403).json({msg : "invalid token"});
        const foundUser = await UserModel.findOne({
            _id : decodeToken.userId
        })
        if(!foundUser) {
            return res.status(403).json({msg : "token invalid, sign in again"});
        }
        req.userId = foundUser._id;
        next();
    }catch(e) {
        if(e.name === "JsonWebTokenError") {
            return res.status(403).json({msg : "Invalid Token"})
        }else if(e.name === "TokenExpiredError") {
            return res.status(403).json({msg : "Token Expired"});
        }
        console.log("Auth Middleware Error", e);
        return res.status(500).json({
            msg : "Internal server error"
        })
    }
}

module.exports = auth;