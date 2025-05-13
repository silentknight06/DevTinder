const express = require("express")
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js")
const User  = require("../models/user.js")

 profileRouter.get("/profile", userAuth, async(req, resp)=>{
    try{
     const user = req.user;
     resp.send(user);
     } catch (err){
         resp.status(400).send("error " + err.message);
     }

  })

  module.exports = profileRouter;