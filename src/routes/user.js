const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA  = ["firstName", "lastName", "photoUrl","age","gender", "about", "skills" ];

userRouter.get("/user/request/received", userAuth, async (req, resp)=>{
    try{
       const loggedInUser = req.user;
       const connectionRequest = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status : "interested",
       }).populate("fromUserId",USER_SAFE_DATA); //  ["firstName", "lastName"] ka matlab bs itn ahi dega firstname, or lastname , all dabase ka value nahi , if i don;t use this then it will give all data 
    // }).populate("fromuserId", "firstName lastName");
       resp.json({
        message: "data Fetched succesfully",
        data : connectionRequest,
       });
    }
    catch(err){
        resp.status(400).send("ERROR : " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async(req, resp)=>{
    try{

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status:"accepted"},
                { fromUserId: loggedInUser._id, status:"accepted"},
            ],
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row)=> {
              if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
              }
        
         return  row.fromUserId;
        });
        resp.json({data});
    }
    
    catch(err){
        resp.status(400).send({message: err.message});
    }
})

module.exports = userRouter;