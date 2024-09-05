const Post = require('../models/Post');
const User = require('../models/User');
const { CustomError } = require('../middlewares/error');

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
        if (!uesr) {
            throw new CustomError("User not found", 404);
        }
        const imageUrls=files.map(file=>generate)

    } catch(error) {
        next(error);
    }
}


module.exports = {
    createPostController,
    createPostWithImageController,
}