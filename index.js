#!/usr/bin/node

// importing express module
const express = require('express');

// instantiating the app to express module
const app = express();

// defining the port
const PORT = 5000;

// creating a get route
app.get("/", (req, res) => {
    res.send("Hello Kingsantus!");
});

// server to listen
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});