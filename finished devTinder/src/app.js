const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user"); 
const cookieParser=require("cookie-parser");

 app.use(express.json());
 app.use(cookieParser());   // <--- missing


    
const authRouter =require("./routes/auth");
const requestRouter =require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);




app.get("/user",async(req,res)=>{
    const userEmail= req.body.emailId;
    try{
        const user = await User.find({emailId:userEmail})
        if(user.length==0){
            res.status(400).send("user not found")
        }
        res.send(user);
    }
    catch{
        res.status(400).send("something went wrong")
    }
    
});



app.delete("/user",async(req,res)=>{
    try{

        const userId= req.body.userId;
        // await User.findOneAndDelete(userId);
        await User.findOneAndDelete({_id: userId});

        res.send("user deleted succsessfully");
    }
    catch{
        res.status(400).send("some thing went wrong");
    } 
})

app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params.userId;
    const data =req.body;
    try{
        const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));

        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("skills cannot be more than 10");
        }
         const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            returnValidaters:true,
            //  new: true,          
            //  runValidators: true 
         });
         console.log(user);
         res.send("user updated succesfully");
    }catch(err){
        res.status(400).send("UPDATE FAILED:"+err.message);
    }
   
});



connectDB()
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(3000, () => {
            console.log("Server is running on port 3000 ...");
        });
    })
    .catch((err) => {
        console.error("Database connection failed: ", err);
    });
