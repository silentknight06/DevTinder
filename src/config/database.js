// {
// const mongoose = require("mongoose");
// const connectDb = async()=>{
//     await mongoose.connect("mongodb://127.0.0.1:27017/localDb");
        
// }
// module.exports = connectDb;


// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/localDb");
//     console.log("MongoDB connected locally");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
// }

const mongoose = require("mongoose");

const connectDb = async() =>{
   await mongoose.connect("mongodb://127.0.0.1:27017/devTinder");
}
module.exports = connectDb;
