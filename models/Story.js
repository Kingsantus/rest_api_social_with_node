#!/usr/bin/env node

const { default: mongoose } = require("mongoose");

// node for user story page


const storySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    image:{
        type:String,
        required:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*60*24,
    },
})


const Story = mongoose.model("Story", storySchema);

module.exports = Story;