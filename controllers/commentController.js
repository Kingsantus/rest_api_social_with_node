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

const deleteCommentController = async (req, res, next) => {
    // get comment id & reply id  from url
    const { commentId } = req.params;
    try {
        // check if commentId exist
        const comment = await Comment.findById(commentId);
        // throw error if not found
        if (!comment) {
            throw new CustomError("Comment not found", 404);
        }
        // find the comment in the post remove it and update
        await Post.findOneAndUpdate(
            {comments:commentId},
            {$pull:{comments:commentId}},
            {new:true}
        )
        // delete the comment
        await comment.deleteOne()

        res.status(200).json({message:"Comment has been deleted!"});
    } catch(error) {
        next(error);
    }
}

const deleteReplyCommentController = async (req, res, next) => {
    // get comment id & reply id  from url
    const { commentId, replyId } = req.params;
    try {
        // check if commentId exist
        const comment = await Comment.findById(commentId);
        // throw error if not found
        if (!comment) {
            throw new CustomError("Comment not found", 404);
        }
        // filter out replyId from comment
        comment.replies = comment.replies.filter(id=>{
            id.toString()!==replyId
        });
        
        // save the comment
        await comment.save();

        res.status(200).json({message:"Reply deleted successfully", comment});

    } catch(error) {
        next(error);
    }
}

const likeCommentController = async (req, res, next) => {
    // get comment id from url
    const { commentId } = req.params;
    // get userId from body
    const { userId } = req.body;
    try {
        // check if commentId exist
        const comment = await Comment.findById(commentId);
        // throw error if not found
        if (!comment) {
            throw new CustomError("Comment not found", 404);
        }
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // check if user have liked the post before
        if (comment.likes.includes(userId)){
            throw new CustomError("Liked this comment before", 400);
        }
        // add the user liking to the comment like
        comment.likes.push(userId);
        // save the comment
        await comment.save()

        res.status(201).json({message:"Comment liked successfully", comment});
    } catch(error) {
        next(error);
    }
}

const dislikeCommentController = async (req, res, next) => {
    // get comment id from url
    const { commentId } = req.params;
    // get userId from body
    const { userId } = req.body;
    try {
        // check if commentId exist
        const comment = await Comment.findById(commentId);
        // throw error if not found
        if (!comment) {
            throw new CustomError("Comment not found", 404);
        }
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // check if user have liked the post before
        if (!comment.likes.includes(userId)){
            throw new CustomError("You have not liked the comment before", 400);
        }
        // filter the comment likes id and remove this user
        comment.likes=comment.likes.filter(id=>id.toString()!==userId);
        // save the comment
        await comment.save()

        res.status(201).json({message:"Comment disliked successfully", comment});
    } catch(error) {
        next(error);
    }
}

const likeReplyCommentController = async (req, res, next) => {
    // get comment id & reply id  from url
    const { commentId, replyId } = req.params;
    // get userId from body
    const { userId } = req.body;
    try {
        // check if commentId exist
        const comment = await Comment.findById(commentId);
        // throw error if not found
        if (!comment) {
            throw new CustomError("Comment not found", 404);
        }
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // check for the replyId in the comment
        const replyComment = comment.replies.id(replyId);
        // throw error if not found
        if (!replyComment) {
            throw new CustomError("Reply comment not found", 404);
        }
        // throw error if user have liked the reply before
        if (replyComment.likes.includes(userId)){
            throw new CustomError("You have liked the reply before", 400);
        }
        // add the user to the reply array
        replyComment.likes.push(userId);
        // save comment
        await comment.save();

        res.status(200).json({message:"Reply comment liked successfully!", comment});
    } catch(error) {
        next(error);
    }
}

const dislikeRelpyCommentController = async (req, res, next) => {
    // get comment id & reply id  from url
    const { commentId, replyId } = req.params;
    // get userId from body
    const { userId } = req.body;
    try {
        // check if commentId exist
        const comment = await Comment.findById(commentId);
        // throw error if not found
        if (!comment) {
            throw new CustomError("Comment not found", 404);
        }
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        // check for the replyId in the comment
        const replyComment = comment.replies.id(replyId);
        // throw error if not found
        if (!replyComment) {
            throw new CustomError("Reply comment not found", 404);
        }
        // throw error if user have not liked the reply before 
        if (!replyComment.likes.includes(userId)){
            throw new CustomError("You have not liked the reply comment", 400);
        }
        // remove the userid from reply likes array
        replyComment.likes = replyComment.likes.filter(id=>id.toString()!==userId);
        // save comment
        await comment.save();

        res.status(200).json({message:"Reply comment disliked successfully!", comment});
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
    deleteCommentController,
    deleteReplyCommentController,
    likeCommentController,
    dislikeCommentController,
    likeReplyCommentController,
    dislikeRelpyCommentController,
}