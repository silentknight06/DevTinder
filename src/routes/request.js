const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js")
const User  = require("../models/user.js")
const ConnectionRequest = require("../models/connectionRequest.js");
// const user = require("../models/user.js");

// sent(interested/ignored) the connectioin request
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

  //(accept/reject) the connection request
 requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, resp)=>{
    // validate the status,
    // deepak send the request to  ->  Praveen
    //logidin user should be praveen (tabhi toh accept )  karenge 
    // status should be interesteed 
    // request Id Should be valid

    try{
        const loggedinInUser = req.user;
        const {status, requestId} = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return resp.status(400).json({ message : "status not allowed!"});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedinInUser._id,
            status:"interested",
        });

        if(!connectionRequest){
            return resp.status(404).json({message: "connection request is not found"})
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        resp.json({message: "conenction request" + status, data});
    }
    catch(err){
        resp.status(400).send("ERROR : " + err.message);
    }
  })
module.exports = requestRouter;