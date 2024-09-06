#!/usr/bin/env node

// importing express module
const express = require('express');
const connectDB = require('./database/db');

// instantiating the app to express module
const app = express();

// add a dotenv file for url of database
const dotenv = require("dotenv");

// importing auth, users router
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const storyRoute = require("./routes/stories");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

// importing path to allow it for middleware
const path = require('path');

// importing cookieParser to add the cookie value
const cookieParser = require('cookie-parser');

// importing error handler, verify token as the middleware
const { errorHandler, CustomError } = require("./middlewares/error");
const verifyToken = require('./middlewares/verifyToken');

// initializing it to config
dotenv.config();

// to allow app to accept json data
app.use(express.json());

// allowing app to pass our cookie
app.use(cookieParser());
// allowing express to view links in "uploads folder"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// instatiating the routes
app.use("/api/auth", authRoute);
app.use("/api/user",verifyToken, userRoute);
app.use("/api/post",verifyToken, postRoute);
app.use("/api/comment", verifyToken, commentRoute);
app.use("/api/story", verifyToken, storyRoute);
app.use("/api/conversation", verifyToken, conversationRoute);
app.use("/api/message", verifyToken, messageRoute);

// instantiationg errorHandler to app
app.use(errorHandler);

// server to listen
app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Server is running on port!");
});