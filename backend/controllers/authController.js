const SignupModel = require("../Models/SignupModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signupController = async (req,res) =>{
    try{
        const {username, password} = req.body;
        

        if(!username || !password ){
            return res.status(400).json({
                success:false,
                message:"Fill all fields"
            })
        }
        
        const checkUser = await SignupModel.find({name:username});
        if(checkUser){
            return res.status(400).json({
            success:false,
            message:"User already exist"
        })}


        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await SignupModel.create({name:username, password:hashedPassword});

        if(!response){
            return res.status(400).json({
                success:false,
                message:"Try Again"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Signup completed",
            data:response
        })

    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:"Signup failed",
            error:error.message
        })
    }
}


exports.loginController = async(req,res) =>{
    try {
        const {name, password} = req.body;

        if(!name || !password ){
            return res.status(400).json({
                success:false,
                message:"Fill all fields"
            })
        }

        const searchOld = await SignupModel.find({name:name});
        if(!searchOld){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }

        if(bcrypt.compare(password, searchOld.password)){
            let payload = {
                name:searchOld.name,
                userId:searchOld._id
            }

            const generateToken =  jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"2h"
            })

            searchOld.generateToken;
        }
        


        return res.status(200).json({
            success:true,
            message:"Login Successfull"
        })
        


    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success:false,
            message:"Login Failed",
            error:error.message
        })
    }
}