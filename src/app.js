const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
app.use(express.json());
const cookieParser = require("cookie-parser");
const cors = require('cors');
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}
));

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter  =   require("./routes/user.js");

app.use("/", authRouter);//saveing data into database (login, signup, logout)
app.use("/", profileRouter); // for profile 
app.use("/", requestRouter); // for send the connection request
app.use("/", userRouter);

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
