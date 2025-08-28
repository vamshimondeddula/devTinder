const express = require ("express");
 const app = express();

app.get("/",(req,res)=>{
    res.send("hello world");
})

app.get("/test",(req,res)=>{
    res.send("im tested");
})

 app.listen(3000,()=>
console.log("connection established")
);