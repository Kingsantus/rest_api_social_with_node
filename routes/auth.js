#!/usr/bin/env node
// Authentication route for users
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
router.post("/login", async (req, res) => {
    try{
        let user;
        if (req.body.email){
            user=await User.findOne({email:req.body.email})
        } else {
            user=await User.findOne({username:req.body.username});
        }

        if(!user) {
            return res.status(404).json("User not found!");
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if(!match) {
            return res.status(401).json("wrong credentials");
        }

        const {password,...data}=user._doc;
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES});
        res.cookie("token",token).status(200).json(data);
    } catch(error) {
        res.status(500).json(error);
    }
})

// LOGOUT


// FETCH

module.exports = router;