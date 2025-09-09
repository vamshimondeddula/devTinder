const mongoose =require("mongoose");
const validator =require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    firstName: {
        type : String ,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName: {
        type:String
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address:" +value);
            }
        },

    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("  enter strong password:" +value);
            }
        },
    },
    age:{
        type:Number
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://www.vecteezy.com/vector-art/43361860-hand-drawnman-avatar-profile-icon-for-social-networks-forums-and-dating-sites-user-avatar-profile-placeholder-anonymous-user-male-no-photo-web-template-default-user-picture-profile-male-symbol",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL:" +value);
            }
        },
    },
    about:{
        type : String,
        default:"this is a default about of the user! "
    },
    skills:{
        type:[String],
    }
},
{
    timestamps: true,
}
);

userSchema.methods.getJWT = async function(){
    const user =this;
    const token = await jwt.sign({_id:user._id},"DEV@Tinder$790",
        {expiresIn:"7d"});
      return token;
};

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user =this;
    const passwordHash=user.password;
    const isPasswordValid =await bcrypt.compare(

        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);