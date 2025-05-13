const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js")
const User  = require("../models/user.js")

requestRouter.post("/sendConnectionRequest", userAuth, (req, resp)=>{

  const user = req.user;

    console.log("sending a connection request");
    resp.send(user.firstName + " sent you a connection Request Sent")

  })

module.exports = requestRouter;