const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA  = ["firstName", "lastName", "photoUrl","age","gender", "about", "skills" ];

userRouter.get("/user/requests/received", userAuth, async (req, resp)=>{
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

userRouter.get("/feed", userAuth, async(req, resp)=>{
    try{
   // user should see all the user cards except
   // 0 His own Card
   // 1 his connections
   // 2 ignored people
   // 3 already sent the connection request;

          const loggedInUser = req.user;

          const page = parseInt(req.query.page) || 1;
          let limit = parseInt(req.query.limit) || 10;
          limit = limit > 50 ? 50 : limit;
          const skip = (page-1)*limit;

          // find all connection request(sent+recived) 
          const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId:loggedInUser._id}
                 ]
          }).select("fromUserId toUserId");

             const hideUsersFromFeed  = new Set();
             connectionRequest.forEach((req) =>{
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());
             });

             const users = await User.find({
                $and: [
                    {_id : { $nin : Array.from(hideUsersFromFeed)}}, // not include the value of hideusrfound
                    {_id: {$ne : loggedInUser._id}}, // not include loginuserid also
                ],
             }).select(USER_SAFE_DATA).skip(skip).limit(limit);


          resp.send(users);
    }
    catch(err){
        resp.status(400).json({message: err.message});
    }
})

module.exports = userRouter;