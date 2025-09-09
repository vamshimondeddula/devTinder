const mongoose =require("mongoose");
const User = require("./user"); 



const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  //refernce to the user collection
        required:true
    },
    toUserId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:true

    },
    status:{
        type:String,
         required:true,
      enum:{
        values:["ignore","interested","accepted","rejected"],
        message:`{value} is incorrect status type`
      }
    }
},
{
    timestamps:true,
}

);
// userSchema.index({gender:1});
// userSchema.index({firstName:1});

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function (next){

    const connectionRequest =this;
    //checks if the fromUserId is same as toUserId
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
       throw new Error("cannot send connection request to yourself")
    }
next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequest;