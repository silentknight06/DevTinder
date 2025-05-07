const express = require("express");
 const connectDb = require("./config/database");
const app = express();
const User = require("./models/user")

app.use(express.json());
app.post("/signup", async(req, resp)=>{
    // console.log(req.body);
    const user = new User(req.body);
    try{
        await user.save();
        resp.send("user added");
    }
    catch (err) {
        resp.status(400).send("error saving  the code " + err.message);
    }

})




connectDb()
.then(()=>{
    console.log("🎉finally Db is connected")
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
      });
})
.catch(()=>{
    console.log("Db  can't be connected")
})




