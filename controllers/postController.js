const Post = require('../models/Post');
const User = require('../models/User');
const { CustomError } = require('../middlewares/error');
const generateFileUrl = require('../middlewares/generateFileUrl');

const createPostController = async (req, res, next) => {
    // get the id and post info from body
    const {userId, caption} = req.body;
    try {
        // get the object of user using userId
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // create post with caption
        const newPost = new Post({
            user:userId,
            caption,
        });

        // save the newPost in Post table
        await newPost.save();
        // add the posts in user Id as it is being referrence
        user.posts.push(newPost._id);
        // save the user table
        await user.save();

        res.status(201).json({message:"Post created successfully!", post:newPost});
    } catch (error) {
        next(error);
    }
}

const createPostWithImageController = async (req, res, next) => {
    // get userId from url
    const { userId } = req.params;
    // get caption from body
    const { caption } = req.body;
    // get image from files
    const files = req.files;
    try {
        // get user object
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // generate links for all pictures uploaded
        const imageUrls=files.map(file=>generateFileUrl(file.filename));
        // create newpost with images and caption
        const newPost = new Post({
            user:userId,
            caption,
            image:imageUrls
        });

        // save new post
        await newPost.save();

        // save post in user post array
        user.posts.push(newPost._id);
        // save the user
        await user.save();

        res.status(201).json({message:"Post Created Successfully!", post:newPost});

    } catch(error) {
        next(error);
    }
}

const updatePostController = async (req,res,next) => {
    // extract postId from url
    const { postId } = req.params;
    const { caption } = req.body;
    try {
        // check if postId in Post
        const postToUpdate = await Post.findById(postId);
        // throw error if not found
        if (!postToUpdate) {
            throw new CustomError("Post not found!", 404);
        }
        // the new caption becomes the caption
        postToUpdate.caption = caption || postToUpdate.caption

        // update post
        await postToUpdate.save();

        res.status(200).json({message:"Post Updated successfully", post:postToUpdate});
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createPostController,
    createPostWithImageController,
    updatePostController,
}