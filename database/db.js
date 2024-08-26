#!/usr/bin/env node
// db.js module to connect to mongodb using Mongoose


// importing mongoose to connect mongodb
const mongoose = require("mongoose");

// connecting to the database
const connectDB = async () => {
    try {
        // connect the client to the server
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database is connected!");
    } catch (error) {
        console.error("Failed to connect to the databse", error);
        throw error;
    }
}

module.exports = connectDB;