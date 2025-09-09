
const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
  "mongodb+srv://balu:JGqiyIITlsiMcYsr@namasthenode.1mvswfk.mongodb.net/devTinder"
);
};

module.exports =connectDB;


