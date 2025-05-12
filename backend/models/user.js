const mongoose = require('mongoose');

//Schema:
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique : true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    //otp fields
    otpToken : {
        type : String, //hashed otp
    },
    otpExpires : {
        type : Date //otp expire time
    }
});
module.exports = mongoose.model("user", userSchema);