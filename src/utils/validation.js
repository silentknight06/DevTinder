const validator = require("validator");

const validateSignUp = (req) =>{
     const {firstName, lastName, emailId, password} = req.body;
     if(!firstName || !lastName){
        throw new Error ("Name is not valis");
     }else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
     }else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong Pw") ;
        
     }
};
module.exports = {validateSignUp}