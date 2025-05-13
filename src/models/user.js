// 
const validator = require("validator");
const mongoose  = require("mongoose");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");
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
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("invalid Email....give corect Email" + value);
      }
    }
  },
  password:{
      type: String,
      require: true,
       validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("your password is weak....give Strong password" + value);
      }
    }
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
    default:"https://ctmirror.org/wp-content/uploads/2021/01/dummy-man-570x570-1.png",
     validate(value){
      if(!validator.isURL(value)){
        throw new Error("invalid URl....give corect URL" + value);
      }
    }
  },
  about:{
    type:String,
    default:"this is defalut value", // this is default value
  },
  skills:{
    type:[String],
  }

},
{
  timestamps:true,
});

userSchema.methods.getJWT = async function(){
  const user = this;
   const token = await jwt.sign({_id: user._id}, "Dev@123", {
               expiresIn:"10d",
           });
           return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password;
  const isPasswordvalid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordvalid
}

module.exports = mongoose.model("User", userSchema);