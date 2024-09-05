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
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { caption },
            { new: true }
        );

        // update post
        await postToUpdate.save();

        res.status(200).json({message:"Post Updated successfully", post:updatedPost});
    } catch (error) {
        next(error);
    }
}

const getPostsController = async (req, res, next) => {
    // get the userId from the params
    const { userId } = req.params;
    try {
        // get user object
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // get all the blacklisted users from the user
        const blockedUsersIds = user.blockList.map(id=>id.toString());
        // find all the post in Post and exclude the blocked users
        // populate (display) username, fullName and Profile picture
        const allPosts = await Post.find({user:{$nin:blockedUsersIds}}).populate("user", "username fullName profilePicture");

        res.status(200).json({posts:allPosts});

    } catch (error) {
        next(error);
    }
}

const getUserPostsController = async (req, res, next) => {
    // get the userId from the params
    const { userId } = req.params;
    try {
        // get user object
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // find all the user post
        const userPosts = await Post.find({user:userId});

        res.status(200).json({posts:userPosts});

    } catch (error) {
        next (error);
    }
}

const deletePostController = async (req, res, next) => {
    // get the postId from the params
    const { postId } = req.params;
    try {
        // get post object
        const postToDelete = await Post.findById(postId);
        // throw error if not found
        if (!postToDelete) {
            throw new CustomError("User not found", 404);
        }
        // get user that posted
        const user = await User.findById(postToDelete.user);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // get the particular post
        user.posts=user.posts.filter(postId=>postId.toString()!==postToDelete._id.toString());
        // save the user 
        await user.save();
        // delete the post
        await postToDelete.deleteOne();

        res.status(200).json({message:"Post deleted successfully"});
    } catch (error) {
        next (error);
    }
}


module.exports = {
    createPostController,
    createPostWithImageController,
    updatePostController,
    getPostsController,
    getUserPostsController,
    deletePostController,
}