#!/usr/bin/env node

const { default: mongoose } = require("mongoose");

// modeule for chat schema


const conversationSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }]
},{timestamps:true});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;