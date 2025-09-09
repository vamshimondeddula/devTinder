
const express = require("express");
const profileRouter = express.Router();
const validator =require("validator");

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
 const {validateEditProfile}=require("../utils/validation")



profileRouter.get("/profile/view",userAuth,async(req,res)=>{

    try{
        const user =  req.user;
        res.send(user);
    }
    catch(err){
    res.status(400).send("ERROR:"+err.message)
}});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
if(!validateEditProfile(req)){
    throw new Error("Invalid Edit Request");
}
   const loggedInUser =req.user;
//    loggedInUser.firstName =req.body.firstName;
//    loggedInUser.lastName =req.body.lastName;
Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));

await loggedInUser.save();

 res.json({message:`${loggedInUser.firstName} your profile updated successfully`,
           data:loggedInUser
});
    }
    catch(err){
        res.status(404).send("Error:"+err.message)
    }
});


profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const password = req.body.password;

        // ✅ Validate password strength
        if (!validator.isStrongPassword(password)) {
            throw new Error("Please enter a strong password!");
        }

        // ✅ Hash new password
        const passwordHash = await bcrypt.hash(password, 10);

        // ✅ Update and save
        loggedInUser.password = passwordHash;
        await loggedInUser.save();

        res.send("Password updated successfully!");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = profileRouter;