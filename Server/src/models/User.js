import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt"



const UserSchema = new mongoose.Schema( {

    name:{
        type: String,
        required:[true,"Name is required"],
        
    },
    email : {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },

    password : {
        type: String,
        required: [true,"password id required"],
        select : false
    },
    role: {
        type: String,
        enu
    }
})  