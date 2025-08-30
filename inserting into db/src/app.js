const express = require("express");


const connectDB = require("./config/database");

 const app = express();

 const User = require("./models/user");

 app.post("/signup",async(req,res)=>{
    const user =new User({
         firstName:"virat",
        lastName:"kohli",
        emailId:"virat@gmail.com",
        password:"virat    123"
    }); 
    try{
        await user.save();
    res.send("User Added successfully "); 
    }
     catch(err){
        res.status(400).send("Error saving the user:"+err.message);
     }
    
 });


connectDB()
.then(()=>{
    console.log("database connection established....");
    app.listen(3000,()=>{
    console.log("connection is established")
})
})
.catch((err)=>{
    console.log("database cannot be connected");
 
});

