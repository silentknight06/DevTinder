const express = require("express");
const app = express();
app.get("/user",(req, resp)=>{
     resp.send("this server created by deepak kumar")
});
app.post("/user", (req, resp)=>{
    resp.send("hey i am hello...")
});
app.delete("/user", (req, resp)=>{
    resp.send("hey this is /deepak servet")
});
app.use("/user", (req, resp)=>{
    resp.send("hey this is /deepak servet")
});

app.listen(3000,()=>{  
    console.log("server is runing...")
});