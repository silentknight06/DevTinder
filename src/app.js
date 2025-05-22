require('dotenv').config();

const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
app.use(express.json());
const cookieParser = require("cookie-parser");
const cors = require('cors');
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // reflect the request origin
  },
  credentials: true,
}));

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
    console.log("Db Connected Sussesfully");
    app.listen(3000, ()=>{
        console.log("app is listeingn on 3000")
    })
 })
    
 .catch(()=>{
    console.log(" DB Can't connected....  error!")
 })
