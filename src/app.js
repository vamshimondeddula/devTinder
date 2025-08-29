const express = require ("express");
 const app = express();

app.get("/user",(req,res)=>{
    res.send({firstName:"Akshay",lastName:"vamshi"});
})

app.post("/user",(req,res)=>{
    res.send("data successfully saved to the database");
})

app.delete("/user",(req,res)=>{
    res.send("deleted");
})

app.use("/test",(req,res)=>{
    res.send("hello from the server")
})
 app.listen(3000,()=>
console.log("connection established")
);
