const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, resp) => {
  try {
    validateSignUpData(req); // validation of data
    // encryption of password

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // console.log(req.body);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const saveUser = await user.save();

    const token = await saveUser.getJWT();

    resp.cookie("token", token, {
     httpOnly: true,
     secure: true,
     sameSite: "none",
     expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),

    });

    resp.json({ message: "added succesfully", data: saveUser });
  } catch (err) {
    resp.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, resp) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User is not valid");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJWT();

      resp.cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      });

      resp.send(user);
    } else {
      throw new Error("User is not correct");
    }
  } catch (err) {
    resp.status(400).send("Err : " + err.message);
  }
});

authRouter.post("/logout", async (req, resp) => {
  resp.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  resp.send("log out succesfully");
});

module.exports = authRouter;
