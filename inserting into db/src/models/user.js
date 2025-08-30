const mongoose =require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type : String
    },
    lastName: {
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender : {
        type : String
    }
});

module.exports = mongoose.model("User",userSchema);