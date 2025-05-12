// {
// const express = require("express");
//  const connectDb = require("./config/database");
// const app = express();
// const User = require("./models/user");
// const req = require("express/lib/request");
// const {validateSignUp} = require("./utils/validation");
// const  bcrypt = require("bcrypt");
// const res = require("express/lib/response");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const auth = require("./middlewares/auth");

// app.use(express.json());

// app.post("/signup", async(req, resp)=>{
//     // console.log(req.body);
//     // const user = new User(req.body);
//     try{

//         validateSignUp(req);

//      const {firstName, lastName,emailId, password} = req.body;
//      const PasswordHash = await bcrypt.hash(password, 10);
//      console.log(PasswordHash);

//         const user = new User({
//             firstName, lastName, emailId, password:PasswordHash,
//         });

//         await user.save();
//         resp.send("user added");
//     }
//     catch (err) {
//         resp.status(400).send("error saving  the code " + err.message);
//     }

// })
 
// app.post("/login", async(req, resp)=>{
//     try{
//          const {emailId, password} = req.body;
//          const user = await User.findOne({emailId:emailId});
//          if(!user){
//             throw new Error("invalid User");
//          }
//          const isPasswordValid =   bcrypt.compare(password, user.password);
//          if(isPasswordValid){

           
//         const token = await jwt.sign({_id : user._id}, "DEV@dk854");
//         console.log(token);



//             resp.cookie("token" , token);
//             resp.send("login succesfull!!");
//             // resp.send("login Succesfully");
//          }else{
//             throw new Error("invalid");
//          }
//     }
//     catch(err){
//         resp.status(400).send("error hi  : " + err.message);
//     }
// })

// app.get("/profile",auth, async(req, resp)=>{
//     try{
//         const user = req.user;
//         resp.send(user);
//     // const cookies  = req.cookies;
//     // const {token} = cookies;
//     // if(!token){
//     //     throw new Error("invalid token");
//     // }
//     // const decodedMessage = await jwt.verify(token, "DEV@dk854");
//     // const {_id} = decodedMessage;
   
//     // const user = await user.findById(_id);
//     // if(!user){
//     //     throw new error("user not exist");
//     // }

//     // console.log("logged in user is " + _id);
//     // console.log(cookies);
//     // resp.send("reading Cookies");
// }catch (err){
//     resp.status(400).send("error" + err.message);
// }
     
// })

//  app.get("/user", async(req, resp)=>{
//     const users = await User.find({emailId: userEmail});
//     if(users.length===0){
//         resp.status(404).send("user not Found");
//     }else{
//         res.send(users);
//     }
//  })

// app.delete("/user", async(req, resp)=>{
//     const userId = req.body.userId;
//     try{
//         const user = await User.findOneAndDelete(userId);
//         resp.send("user deleted ");
//     }
//     catch (err) {
//         resp.status(404).send("something went Wrong");
//     }
// })

// connectDb()
// .then(()=>{
//     console.log("🎉finally Db is connected")
//     app.listen(3000, () => {
//         console.log("Server running on http://localhost:3000");
//       });
// })
// .catch(()=>{
//     console.log("Db  can't be connected")
// })

// }
const express = require("express");
const app = express();
 const connectDB = require("./config/database.js");
const User  = require("./models/user.js")
const {validateSignUpData} = require("./utils/validation");
app.use(express.json());
const bcrypt = require("bcrypt");

  // save the data into Database!
  app.post("/signup", async(req, resp)=>{
    try{
    validateSignUpData(req);   // validation of data
     // encryption of password

    const {firstName, lastName, emailId , password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash)

    // console.log(req.body);
    
        const user = new User({
            firstName, lastName, emailId, password:passwordHash
        })
          await user.save();
          resp.send("added succesfully")
    }
    catch (err){
        resp.status(400).send("ERROR: " + err.message);
    }
  });

  //For the Login
  app.post("/login", async(req, resp)=>{
    try{
         const {emailId, password} = req.body;
         const user = await User.findOne({emailId: emailId});
         if(!user){
            throw new Error("User is not valid");
         }
         const isPasswordValid = await bcrypt.compare(password, user.password);
         if(isPasswordValid){
            resp.send("login succsfully");
         }else{
              throw new Error("User is not correct");
         }
        }
    catch (err){
        resp.status(400).send("Err : "+ err.message);
    }
  } )

  // find data with help email
  app.get("/user", async(req, resp)=>{
    const userEmail = req.body.emailId;

    try{
        const user = await User.find({emailId:userEmail});
        if(user.length===0){
            resp.status(400).send("user not found");
        }else
        resp.send(user);
    }catch(err){
        resp.status(400).send("something went wrong..");
    }
  })

  // Get/Feed = get all the users from the database!
  app.get("/feed", async(req, resp)=>{
    // const userEmail = req.body.emailId;

    try{
        const user = await User.find({});
        console.log(user);
        if(user.length===0){
            resp.status(400).send("user not found");
        }
        resp.send(user);
    }catch(err){
        resp.status(400).send("something went wrong..");
    }
  })

  // Deleete the user 
  app.delete("/user", async(req, resp)=>{
    const userId = req.body.userId;
    try{
       const user =  await User.findByIdAndDelete(userId);
       resp.send("User Deelted succesfully..");
    }
    catch(err){
        resp.status(400).send('user not deleted');
    }
  })

  // Update the Data into Database;
  app.patch("/user/:userId", async(req, resp)=>{
    const userId = req.params?.userId;
    const data = req.body;
   
    try{
     const ALLOWED_UPDATES = [
                "photoUrl","about", "gender", "age", "skills",
          ];
    const isUpdateAllowed = Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
          );
     if(!isUpdateAllowed){
        throw new Error("updated not Allowed");
     }

     if(data?.skills.length>10){
        throw new error("skills length is more then required");
     }
     const user = await User.findByIdAndUpdate({_id: userId}, data,{
        returnDocument:"after",
        runValidators:true,
     });
     console.log(user);
     resp.send("user updated sucesfully...");
    }
    catch(err){
        resp.status(400).send("data caont be updated (catch)" + err.message)
    }
  })

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
