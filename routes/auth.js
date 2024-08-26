#!/usr/bin/env node
// Authentication route for users
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTRATION
router.post("/register", async (req, res) => {
    try{
        const {password, username, email}=req.body;
        const existingUser=await User.findOne({ $or: [{username}, {email}] });
        if (existingUser){
            res.status(400).json("Username or Email already exists!");
        }
        // if (confirmPassword != password){
        //     res.status(400).json("Both password is incorrect");
        // }
        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        const newUser=new User({...req.body,password:hashedPassword});
        const savedUser=await newUser.save();
        res.status(201).json(savedUser);
    } catch(error) {
        res.status(500).json(error);
    }
})

// LOGIN

// LOGOUT

// FETCH

module.exports = router;