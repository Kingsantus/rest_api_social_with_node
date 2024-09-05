const express = require('express');
const {
    createCommentController,
    createCommentReplyController,
    updateCommentController,
    updateReplyCommentController,
    getCommentsByPostController,
    deleteCommentController,
    deleteReplyCommentController,
    likeCommentController,
    dislikeCommentController,
} = require('../controllers/commentController');
const router = express.Router();


// CREATE COMMENT
router.post("/create", createCommentController);

// CREATE COMMENT REPLY
router.post("/reply/:commentId", createCommentReplyController);

// UPDATE COMMENT
router.put("/update/:commentId", updateCommentController);

// UPDATE REPLY COMMENT
router.put("/update/:commentId/replies/:replyId", updateReplyCommentController);

// GET ALL POST COMMENTS
router.get("/post/:postId", getCommentsByPostController);

// DELETE COMMENT
router.delete("/delete/:commentId", deleteCommentController);

// DELETE REPLY COMMENT
router.delete("/delete/:commentId/replies/:replyId", deleteReplyCommentController)

// LIKE A COMMENT
router.post("/like/:commentId", likeCommentController);

// UNLIKE COMMENT
router.post("/dislike/:commentId", dislikeCommentController);

// LIKE REPLY COMMENT 

// UNLIKE REPLY COMMENT

module.exports = router;
