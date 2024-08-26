#!/usr/bin/env node

// importing express module
const express = require('express');

// instantiating the app to express module
const app = express();

// defining the port
const PORT = 5000;

// creating a get route
app.get("/", (req, res) => {
    res.send("Hello Kingsantus welcome!!");
});

// creating dummy data
const posts = [
    {id:1, title:"first post", content:"this my first time"},
    {id:2, title:"second post", content:"this my second post"},
    {id:3, title:"third post", content:"this my third update"},
]

// sending dummy data with json
app.get('/posts', (req, res) => {
    res.json(posts);
});

// getting idividual id
app.get('/posts/:id', (req, res) => {
    // get the id after /posts
    const postID = parseInt(req.params.id);
    // interate and ensure the postID is found in post
    const post=posts.find((p)=>p.id===postID);
    // validation
    if(!post){
        return res.status(404).json({error:"Post not found"});
    }
    res.send(post);
})

// creating a post route
app.post("/posts", (req, res) => {
    const title = "more post";
    const content = "This is another post";
    const newPost = {id:posts.length+1, title, content}
    posts.push(newPost);
    res.status(201).json(newPost);
})

// server to listen
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});