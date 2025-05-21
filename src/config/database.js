
const mongoose = require("mongoose");
console.log(process.env.DB_CONNECTION_SECRET);
console.log(process.env.JWT_SECRET);
const connectDb = async() =>{
   await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}
module.exports = connectDb;
