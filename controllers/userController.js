const { CustomError } = require('../middlewares/error');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Story = require('../models/Story');
const generateFileUrl = require('../middlewares/generateFileUrl');


const getUserController = async (req, res, next) => {
    // get the userId in link parameter provided
    const { userId } = req.params;
    try {
        // find the id in the database if it exist
        const user = await User.findById(userId);
        // if it don't exist
        if (!user) {
            throw new CustomError("No user found", 404);
        }

        // if user exist the exclude password and get the data from user
        const {password, ...data} = user._doc;

        res.status(200).json(data);
    } catch(error) {
        next(error);
    }
}

const updateUserController = async (req, res, next) => {
    // get user id fro url
    const { userId } = req.params;
    // get update data from body
    const updateData = req.body;
    try {
        // get the user object using the userId
        const userToUpdate = await User.findById(userId);
        // throw error if not found
        if (!userToUpdate) {
            throw new CustomError("User not found!", 404);
        }
        // assign the updatedata to the userId
        Object.assign(userToUpdate,updateData);
        // save to database
        await userToUpdate.save();
        // send response successfully
        res.status(200).json({message:"User updated Successfully!", user:userToUpdate});
    } catch(error) {
        next(error);
    }
};

const followUserController = async (req, res, next) => {
    // get the userId from url
    const { userId } = req.params;
    // get the id of user from the body
    const { _id } = req.body;
    try {
        // if both user and id are same abort
        if (userId==_id){
            throw new CustomError("You cannot follow yourself", 500);
        }
        // get the user to be followed object
        const userToFollow = await User.findById(userId);
        // get the user following object
        const loggedInUser = await User.findById(_id);
        // if followed user or following user not found throw error
        if (!userToFollow || !loggedInUser) {
            throw new CustomError("User not found", 404);
        }
        // if the following user is already following each other throw error
        if (loggedInUser.following.includes(userId)) {
            throw new CustomError("Already following this user!", 400);
        }
        // add the user info to both users
        loggedInUser.following.push(userId);
        userToFollow.followers.push(_id);
        // save the users info to database
        await loggedInUser.save();
        await userToFollow.save();
        // return response
        res.status(201).json({message:"Successfully followed user!"});
    } catch(error) {
        next(error);
    }
}

const unfollowUserController = async (req, res, next) => {
    // get the userId from url
    const { userId } = req.params;
    // get the id of user from the body
    const { _id } = req.body;
    try {
        // if both user and id are same abort
        if (userId==_id){
            throw new CustomError("You cannot unfollow yourself", 500);
        }
        // get the user to be followed object
        const userToUnFollow = await User.findById(userId);
        // get the user following object
        const loggedInUser = await User.findById(_id);
        // if followed user or following user not found throw error
        if (!userToUnFollow || !loggedInUser) {
            throw new CustomError("User not found", 404);
        }
        // if the following user is not following each other throw error
        if (!loggedInUser.following.includes(userId)) {
            throw new CustomError("Not following this user!", 400);
        }
        // remove the user info to both users
        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId);
        userToUnFollow.followers=userToUnFollow.followers.filter(id=>id.toString()!==_id);
        // save the users info to database
        await loggedInUser.save();
        await userToUnFollow.save();
        // return response
        res.status(201).json({message:"Successfully unfollowed user!"});
    } catch(error) {
        next(error);
    }
}

const blockUserController = async (req, res, next) => {
    // get userId fro url
    const { userId } = req.params;
    // get -id from the request body
    const { _id } = req.body;
    try {
        // if both user to be blocked and user blocking is same
        // return error
        if (userId === _id) {
            throw new CustomError("You can not block yourself", 500);
        }
        // get the object of userId to be blocked
        const userToBlock = await User.findById(userId);
        // get of object of id of user blocking
        const loggedInUser = await User.findById(_id);

        // if the logged or user to be block is not found
        // throw error
        if (!loggedInUser || !userToBlock) {
            throw new CustomError("User not found!", 404);
        }

        // if user to belock is already in the logged user
        // blocklist throw error
        if (loggedInUser.blockList.includes(userId)) {
            throw new CustomError("This user is already blocked", 404);
        }

        // if it not in the blocklist and available
        // add to loggedIn User blocklist
        loggedInUser.blockList.push(userId);

        // if the block list is in following of loggedIn User unfollow
        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId);
        userToBlock.followers=userToBlock.followers.filter(id=>id.toString()!==_id);

        // save both of the users
        await loggedInUser.save();
        await userToBlock.save();

        res.status(200).json({message:"User is Blocked successfully!"});

    } catch(error) {
        next(error);
    }
}

const unblockUserController = async (req, res, next) => {
    // get userId fro url
    const { userId } = req.params;
    // get -id from the request body
    const { _id } = req.body;
    try {
        // if both user to be unblocked and user ubblocking is same
        // return error
        if (userId === _id) {
            throw new CustomError("You can not unblock yourself", 500);
        }
        // get the object of userId to be unblocked
        const userToUnBlock = await User.findById(userId);
        // get of object of id of user unblocking
        const loggedInUser = await User.findById(_id);

        // if the logged or user to be unblock is not found
        // throw error
        if (!loggedInUser || !userToUnBlock) {
            throw new CustomError("User not found!", 404);
        }

        // if user to be unblock is not in the logged user
        // blocklist throw error
        if (!loggedInUser.blockList.includes(userId)) {
            throw new CustomError("This user is not blocked by you", 404);
        }

        // remove the userId from the block list
        loggedInUser.blockList=loggedInUser.blockList.filter(id=>id.toString()!==userId);


        // save the users
        await loggedInUser.save();

        res.status(200).json({message:"User is Unblocked successfully!"});

    } catch(error) {
        next(error);
    }
}

const getBlockedUsersController = async (req, res, next) => {
    // get user from url
    const { userId } = req.params;
    try {
        // find the userId in the database, with other information
        const user = await User.findById(userId).populate("blockList","username fullName profilePicture");
        // if not found throw error
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // destructure blocklist from other data
        const {blockList,...data} = user;
        // response is the information in block list of user
        res.status(200).json(blockList)
    } catch (error) {
        next(error);
    }
}

const deleteUserController = async (req, res, next) => {
    // get userId from params
    const { userId } = req.params;
    try {
        // get the object of user
        const userToDelete = await User.findById(userId);
        // if userToDelete is not found throw error
        if (!userToDelete) {
            throw new CustomError("User not found", 404);
        }

        // delete all users post
        await Post.deleteMany({user:userId});
        // delete comment from all post
        await Post.deleteMany({"comments.user":userId});
        // delete comment replies from all post
        await Post.deleteMany({"comments.replies.user":userId});
        // delete users comments
        await Comment.deleteMany({user:userId});
        // delete story posted by user
        await Story.deleteMany({user:userId});
        // delete likes by user in post and update the list
        await Post.updateMany({likes:userId},{$pull:{likes:userId}});
        // unfollow all users followed by user
        await User.updateMany(
            {_id:{$in:userToDelete.following}},
            {$pull:{followers:userId}}
        );
        // delete all likes liked by user in comment and update the like list
        await Comment.updateMany({}, {$pull:{likes:userId}});
        // delete all likes liked by user in comment replies and update the like list
        await Comment.updateMany({"replies.likes":userId}, {$pull:{"replies.likes":userId}});
        // delete all likes liked by user on post
        await Post.updateMany({}, {$pull:{likes:userId}});
        // get all users from replies with the same userId
        const replyComments = await Comment.find({"replies.user":userId});
        // wait and remove all of them
        await Promise.all(
            replyComments.map(async(comment)=>{
                comment.replies=comments.replies.filter((reply)=>reply.user.toString()!=userId);
                await Comment.save();
            })
        );
        // delete user with the userId
        await userToDelete.deleteOne();
        res.status(200).json({message:"Everything about User have been deleted Successfully!"});

    } catch(error) {
        next(error);
    }
}

const searchUserController = async (req, res, next) => {
    // get the search query from url
    const { query } = req.params;
    try {
        // find user object using regular expression
        // check the query as a username or fullName
        const users = await User.find({
            $or:[
                {username:{$regex:new RegExp(query, 'i')}},
                {fullName:{$regex:new RegExp(query, 'i')}}
            ]
        });
        res.status(200).json({users});
    } catch (error) {
        next(error);
    }
}

const uploadProfilePictureController = async (req, res, next) => {
    // get the userId from url
    const { userId } = req.params;
    // extract the file uploaded from request file
    const { filename } = req.file;
    try {
        // get the update the user object using the userId
        // updating only the generated file url in the file
        // new:true ensures it can create as many
        const user = await User.findByIdAndUpdate(userId, {profilePicture:generateFileUrl(filename)},{new:true});
        // if the user not found throw error
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        res.status(200).json({message:"Profile picture updated successfully", user});

    } catch (error) {
        next(error);
    }
}

const uploadCoverPictureController = async (req, res, next) => {
    // get the userId from url
    const { userId } = req.params;
    // extract the file uploaded from request file
    const { filename } = req.file;
    try {
        // get the update the user object using the userId
        // updating only the generated file url in the file
        // new:true ensures it can create as many
        const user = await User.findByIdAndUpdate(userId, {coverPicture:generateFileUrl(filename)},{new:true});
        // if the user not found throw error
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        res.status(200).json({message:"Cover picture updated successfully", user});

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUserController,
    updateUserController,
    followUserController,
    unfollowUserController,
    blockUserController,
    unblockUserController,
    getBlockedUsersController,
    deleteUserController,
    searchUserController,
    uploadProfilePictureController,
    uploadCoverPictureController,
}