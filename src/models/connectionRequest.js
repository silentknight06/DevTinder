const mongoose = require("mongoose");
const { applyTimestamps } = require("./user");
const  connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", //reference to the user collection 
        require: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }, 
    status: {
        type: String,
        required:true,
        enum:{
            values: ["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`,
        }
    },

},{
    timestamps:true,
});

// doing indexing for fast query searching
 connectionRequestSchema.index({fromUserId:1, toUserId:1}); // 1 for increasing, -1 for decresing 

connectionRequestSchema.pre("save", function(next){

    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("can't send connection request to yourself");
    }
    next();
})


const connectionRequestModel = new mongoose.model(
    "connectionRequest", connectionRequestSchema
);
module.exports = connectionRequestModel;