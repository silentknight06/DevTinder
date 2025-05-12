// 

const mongoose  = require("mongoose");
const userSchema = new mongoose.Schema({
   
  firstName:{
    type : String,
    require:true,
    minLength:3,
    maxLength:50,
  },
  lastName:{
    type : String,
  },
  emailId:{
    type : String,
    require: true, // mandatory filed
    unique: true, // all email should unique
    lowercase: true, //  take as a lowercase value
    trim:true, // remove the extra space
  },
  password:{
      type: String,
      require: true,
  },
  age:{
      type:Number,
      min:18,
     
  },
  gender:{
    type:String,
     validate(value){
        if(!["male", "female", "others"].includes(value)){
          throw new Error("gender is not valid");
        }
      },
  },
  photoUrl:{
    type:String,
    default:"https://ctmirror.org/wp-content/uploads/2021/01/dummy-man-570x570-1.png"
  },
  about:{
    type:String,
    default:"this is defalut value", // this is default value
  },
  skills:{
    type:[String],
  }

},{
  timestamps:true,
})

module.exports = mongoose.model("User", userSchema);