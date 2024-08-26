#!/usr/bin/env node
// User model schema

// importing mongoose
const mongoose = require("mongoose");

// defining the information required in schema database
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    bio:{
        type:String,
        trim: true,
        lowercase:true,
    },
    profilePicture:{
        type:String,
        default:"",
    },
    coverPicture:{
        type:String,
        default:"",
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    blockList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
},{timestamps:true});

// Users peged to userSchema
const User = mongoose.model("User", userSchema);

module.exports = User;