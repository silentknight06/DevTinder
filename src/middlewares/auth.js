const jwt   = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async(req, resp, next) =>{
    // read the token from the request cookies
    // validate the token
    // Find the user , that  is exist or not
     try{
        const {token} = req.cookies;
        if(!token){
            return resp.status(401).send("please Login..");
            throw new Error("token is not valid");
        }
        const decodedobj = await jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decodedobj;
        
        const user = await User.findById(_id);
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

module.exports = {userAuth};