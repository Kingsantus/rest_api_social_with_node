#!/usr/bin/env node

// importing express module
const express = require('express');
const connectDB = require('./database/db');

// instantiating the app to express module
const app = express();

// add a dotenv file for url of database
const dotenv = require("dotenv");

// importing auth router
const authRoute = require("./routes/auth");

// initializing it to config
dotenv.config();

// to allow app to accept json data
app.use(express.json());

// instatiating the middleware
app.use("/api/auth", authRoute);


// server to listen
app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Server is running on port!");
});