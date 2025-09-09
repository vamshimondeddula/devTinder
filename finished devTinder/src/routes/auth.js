const express = require("express");
 const authRouter = express.Router();

 const User = require("../models/user");
 const {validateSignUpData}=require("../utils/validation");
 const bcrypt =require("bcrypt");
 const cookieParser=require("cookie-parser");
 const jwt =require("jsonwebtoken");
 const { userAuth } = require("../middlewares/auth");

 authRouter.post("/signup", async (req, res) => {
     // const user = new User(req.body);
     try {
         validateSignUpData(req);
         const{firstName,lastName,emailId,password}=req.body;
         const passwordHash = await bcrypt.hash(password,10);
         // console.log(passwordHash);
         const user = new User(
             {
                firstName,
                lastName,
                emailId,
                password:passwordHash,
             }
         );
 
         await user.save();
         res.send("User Added successfully");
     } catch (err) {
         res.status(400).send("Error: " + err.message);
     }
 });

 authRouter.post("/login", async (req, res) => {
   try {
     const { emailId, password } = req.body;
 // first getting user data
     const user = await User.findOne({ emailId: emailId });
     if (!user) {
       throw new Error("EmailID id not present in DB");
     }
 // finding is password is matching or not
     const isPasswordValid = await user.validatePassword(password);
 
     if (isPasswordValid) {
 
         //  generate a token when user will logs in with userId it is like key value pair we are  assiginig userId as _id 
         const token =await user.getJWT();
 
         // ""=> token name ,
         // res =>sedning the token we can later acces by req.cookies.token;
        //  res.cookie("token",token,{expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        //  });
        //  res.send("Login Succesfull!!!");

         // LOGIN
res.cookie("token", token, {
  
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
});
res.send("Login Successful!!!");


     } else {
       throw new Error("Password id not correct");
     }
   } catch (err) {
     res.status(400).send("ERROR : " + err.message);
   }
 });
  
authRouter.post("/logout",async(req,res)=>{

  
         // LOGOUT
res.cookie("token", "", {
  
  expires: new Date(0)  // immediately expire
});
res.send("Logout successful");


 });


 module.exports = authRouter;