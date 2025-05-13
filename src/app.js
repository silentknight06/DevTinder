const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use("/", authRouter);//saveing data into database (login, signup, logout)
app.use("/", profileRouter); // for profile 
app.use("/", requestRouter); // for send the connection request

 connectDB()
 .then(()=>{
    console.log("dekho db connect ho gaya 😁");
    app.listen(3000, ()=>{
        console.log("app is listeingn is 300000")
    })
 })
    
 .catch(()=>{
    console.log("error loading.....")
 })
