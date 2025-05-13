const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js")
const User  = require("../models/user.js")
const ConnectionRequest = require("../models/connectionRequest.js");
// const user = require("../models/user.js");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, resp)=>{
try{

  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;
  const status = req.params.status;

  const allowedStatus = ["ignored", "interested"];
  if(!allowedStatus.includes(status)){
    return resp.status(400).json({message : "invalid status type" + status});
  }

   const toUser = await User.findById(toUserId);
   if(!toUser){
    return resp.status(404).json({message: "User not found !"});
   }
     
   // for checking allready send a request or in pending state
   const existingConnectionRequest = await ConnectionRequest.findOne({
    $or: [
        {fromUserId, toUserId},
        {fromUserId:toUserId, toUserId:fromUserId},
    ]
   });
   if(existingConnectionRequest){
    return resp.status(400).send({
        message: "connection Request Allready Existtt"
    });
   }



  const connectionRequest = new ConnectionRequest({
    fromUserId, toUserId, status
  });
  const data = await connectionRequest.save();
  resp.json({
    message: req.user.firstName + " is " + status + " to " + toUser.firstName,
    data,
  })


}
catch (err){
      resp.status(400).send("error : " + err.message);
}
    // resp.send(user.firstName + " sent you a connection Request Sent")

  })

module.exports = requestRouter;