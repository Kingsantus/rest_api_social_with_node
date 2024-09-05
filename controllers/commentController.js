const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { CustomError } = require('../middlewares/error');


const createCommentController = async (req, res, next) => {
    // get userId,postId,text form body
    const {postId, userId, text } = req.body;
    try {
        // get post with postId
        const post = await Post.findById(postId);
        // throw error if not found
        if (!post) {
            throw new CustomError("Post not found", 404);
        }
        // check user with userId
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // add the info to comment session
        const newComment = new Comment({
            user:userId,
            post:postId,
            text,
        });
        // save comment
        await newComment.save();
        // add comment to the post
        post.comments.push(newComment._id);
        // save post
        await post.save();

        res.status(201).json({message:"Comment added to Post Successfully",comment:newComment});


    } catch (error) {
        next (error);
    }
}


const createCommentReplyController = async (req, res, next) => {
    // get comment id from url
    const { commentId } = req.params;
    // get userId,text form body
    const { userId, text } = req.body;
    try {
        // check if commentId exist
        const parentComment = await Comment.findById(commentId);
        // throw error if not found
        if (!parentComment) {
            throw new CustomError("Comment not found", 404);
        }
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // assign the reply in it structure
        const reply = {
            text,
            user:userId,
        }

        // add the reply to the comment
        parentComment.replies.push(reply);
        // save the comment
        await parentComment.save();

        res.status(201).json({message:"Reply have been created", reply});
    } catch (error) {
        next (error);
    }
}


const updateCommentController = async (req, res, next) => {
    // get comment id from url
    const { commentId } = req.params;
    // get text form body
    const { text } = req.body;
    try {
        // check if commentId exist
        const commentToUpdate = await Comment.findById(commentId);
        // throw error if not found
        if (!commentToUpdate) {
            throw new CustomError("Comment not found", 404);
        }
        // find and update the comment with the text
        const updatedComment = await Comment.findByIdAndUpdate(commentToUpdate,{text},{new:true});

        res.status(200).json({message:"Comment updated successfully", updatedComment});
    } catch (error) {
        next (error);
    }
}


const updateReplyCommentController = async (req, res, next) => {
    // get comment id & reply id  from url
    const { commentId, replyId } = req.params;
    // get text form body
    const { text, userId } = req.body;
    try {
        // check if commentId exist
        const parentComment = await Comment.findById(commentId);
        // throw error if not found
        if (!parentComment) {
            throw new CustomError("Comment not found", 404);
        }
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // iterate to find the reply index
        const replyIndex = parentComment.replies.findIndex((reply)=>reply._id.toString()===replyId);
        // throw error if not found
        if (replyIndex === -1) {
            throw new CustomError("Reply not found", 404);
        }
        // authorization of owner of replies
        if (parentComment.replies[replyIndex].user.toString()!==userId){
            throw new CustomError("You can not change another user reply", 404);
        }
        // replace the text with the text of reply index
        parentComment.replies[replyIndex].text = text;
        // save the parentComment
        await parentComment.save();

        res.status(200).json({message:"Reply updated successfully", parentComment});
    } catch (error) {
        next (error);
    }
}

const populateUserDetails = async (comments) => {
    // populateUserDetails arrange how information will be represented
    // each comment in the post
    for (const comment of comments) {
        // display their user with username fullName & profilePicture
        await comment.populate("user", "username fullName profilePicture");
        // if there is user in the comment
        if (comment.replies.length>0){
            // display users that reply with username fullName & profilePicture
            await comment.populate("replies.user", "username fullName profilePicture");
        }
    }
}

const getCommentsByPostController = async (req, res, next) => {
    // get postId from url
    const { postId } = req.params;
    try {
        // check if post exist
        const post = Post.findById(postId);
        // throw error if not found
        if (!post){
            throw new CustomError("Post not found", 404);
        }
        // get all comment associated with the post
        let comments = await Comment.find({post:postId});
        // populate how the comment will be displayed
        await populateUserDetails(comments);

        res.status(200).json({comments});
    } catch(error) {
        next(error);
    }
}

module.exports = {
    createCommentController,
    createCommentReplyController,
    updateCommentController,
    updateReplyCommentController,
    getCommentsByPostController,
}