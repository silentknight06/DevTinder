const mongoose = require("mongoose");
const connectDb = async () => {
  await mongoose.connect(process.env.MONGODB_STRING);

};
module.exports = connectDb;