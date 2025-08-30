const express = require ("express");
 const app = express();

app.use

app.use("/user",(req,res,next)=>{
    // res.send("hello from the server")
    console.log("we are using next here")
    next();
},

    (req,res)=>{
    res.send("hello from the server")
    console.log("we are using next here")
    
})
 app.listen(3000,()=>
console.log("connection established")
);
