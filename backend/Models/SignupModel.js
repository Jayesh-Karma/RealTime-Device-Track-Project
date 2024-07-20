const mongoose = require("mongoose");

const signupModel = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
})


module.exports = mongoose.model("signup", signupModel)