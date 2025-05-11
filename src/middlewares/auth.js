const jwt   = require("jsonwebtoken");
const user = require("../models/user");
const userAuth = async(req, resp, next) =>{
     try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("token is not valid");
        }
        const decodeobj = await jwt.verify(token, "DEV@dk854");
        const {_id} = decodeobj;
        
        const user = await UserActivation.findById(_id);
        if(!user){
            throw new Error("user not Found");
        }
        req.user = user;
        next();
     }
     catch(err){
         resp.status(400).send("error" + err.message);
     }
};
module.exports = userAuth;