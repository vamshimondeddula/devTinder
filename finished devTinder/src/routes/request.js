
const express = require("express");
 const requestRouter = express.Router();
 const User = require("../models/user");
 const { userAuth } = require("../middlewares/auth");
 const ConnectionRequest=require("../models/connectionRequest");

 requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
   try{
    const fromUserId=req.user._id;
    const toUserId = req.params.toUserId;
    const status =req.params.status;

    const allowedStatus =["interested","ignore"];
    if(!allowedStatus.includes(status)){
        return res
        .status(404)
        .json({message:"Invalid Status type:" +status})
    }

    const toUser = await User.findById(toUserId);

    if(!toUser){

        return res.status(400).json({
            message:"User not found!"
        })

    }


    //if there is an existing connection request
    const existingConnectionRequest =await ConnectionRequest.findOne(

      {  $or:[{fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId},
        ]
        }
    ) ;   

    if(existingConnectionRequest){
        return res.status(400).json({
            message:"Connection request already exist!!"
        });
    }

    const newRequest =new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    })
    const data = await newRequest.save();
    res.json({
        message:"connection request sent Successfully!",
        data,
    });

   }
   catch(err){

    res.status(400).send("ERROR"+ err.message);

   }
})

requestRouter.post("/request/review/:status/:requestId",userAuth,
    async(req,res)=>{
   try{ const{requestId,status}=req.params;
    const loggedInUser =req.user;

    const allowedStatus=["accepted","rejected"];
    isValidStatus=allowedStatus.includes(status);
    if(!isValidStatus){
        return res.status(404).json({
            message:"invalid status type"
        })
    }
  const connectionRequest= await ConnectionRequest.findOne({

        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested",
  });

  if(!connectionRequest){
    return res.status(404).json({message:"Connection request not found"});
  }
  connectionRequest.status=status;
const  data=await connectionRequest.save();

res.json({
    message:"connection request"+status,data
});
}
catch(err){
    res.status(400).send("ERROR:"+err.message);
}
})



module.exports = requestRouter;