const express = require("express");
const app = express();
app.use("/",(req, resp)=>{
     resp.send("this server created by deepak kumar")
});
app.get("/hello", (req, resp)=>{
    resp.send("hey i am hello...")
});
app.get("/deepak", (req, resp)=>{
    resp.send("hey this is /deepak servet")
});

app.listen(3000,()=>{
    console.log("server is runing...")
});