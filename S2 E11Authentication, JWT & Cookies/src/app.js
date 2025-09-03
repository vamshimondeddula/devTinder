const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt =require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt =require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
// first getting user data
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("EmailID id not present in DB");
    }
// finding is password is matching or not
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {

        //  generate a token when user will logs in with userId it is like key value pair we are  assiginig userId as _id 
        const token =await jwt.sign({_id:user._id},"DEV@Tinder$790");
        console.log(token);

        // ""=> token name ,
        // res =>sedning the token we can later acces by req.cookies.token;
        res.cookie("token",token);
        res.send("Login Succesfull!!!");
    } else {
      throw new Error("Password id not correct");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile",async(req,res)=>{
    
    try
    {const cookies =req.cookies;
    const {token}=cookies;
    // const token =req.cookies.token;
    if(!token){
        throw new Error("Invalid credentials");
    }

    // validate my token
    const decodeMessage =await jwt.verify(token,"DEV@Tinder$790");
    // once we will decode we will get id because we generated token by user_Id
    // console.log(cookies);
    const{_id}=decodeMessage;
    console.log("Logged in user is:"+_id);
    const user =await User.findById(_id);
    res.send(user);
}catch(err){
    res.status(400).send("ERROR:"+err.message)
}
    

});

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

app.get("/feed",async(req,res)=>{

    try{
        const user= await User.find({});
        if(user.length==0){
            res.send("no user found")
        }
        res.send(user);
    }
    catch{
        res.status(400).send("some thing went wrong")
    }
})

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
