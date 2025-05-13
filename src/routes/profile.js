const express = require("express")
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js")
const User  = require("../models/user.js")
const{validateEditProfileData} = require("../utils/validation.js")
 profileRouter.get("/profile/view", userAuth, async(req, resp)=>{
    try{
     const user = req.user;
     resp.send(user);
     } catch (err){
         resp.status(400).send("error " + err.message);
     }

  })

  profileRouter.patch("/profile/edit", userAuth, async(req, resp)=>{
       try{
         if(!validateEditProfileData(req)){
           throw new Error("invalid Edit Request");
         }
         const loggedInUseruser = req.user;
         console.log(loggedInUseruser);

         Object.keys(req.body).forEach((key)=>(loggedInUseruser[key] = req.body[key]));
         console.log(loggedInUseruser);
        
        await  loggedInUseruser.save();
        //  resp.send(`${loggedInUseruser.firstName},  your profile updated succesfully`);
        resp.json({
            message: `${loggedInUseruser.firstName},  your profile updated succesfully`,
            data:loggedInUseruser,
        });
       }
       catch(err){
         resp.status(400).send("Error" + err.message);
       }
  })

  module.exports = profileRouter;