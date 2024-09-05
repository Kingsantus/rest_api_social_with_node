const express = require('express');
const {
    createCommentController,
    createCommentReplyController,
    updateCommentController,
    updateReplyCommentController,
    getCommentsByPostController,
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

module.exports = router;
