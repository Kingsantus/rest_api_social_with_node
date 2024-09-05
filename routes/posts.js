const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
    createPostController,
    createPostWithImageController,
    updatePostController,
    getPostsController,
    getUserPostsController,
    deletePostController,
    likePostController,
    dislikePostController,
} = require('../controllers/postController');


// CREATE POST
router.post("/create", createPostController);

// CREATE POST WITH IMAGE
// upload.array indicate images to be uploaded and it should be maximum of five
router.post("/create/:userId", upload.array("images",5),createPostWithImageController);

// UPDATE POST
router.put("/update/:postId", updatePostController);

// GET ALL POSTS
router.get("/all/:userId", getPostsController);

// GET USER POSTS
router.get("/user/:userId", getUserPostsController);

// DELETE A POST
router.delete("/delete/:postId", deletePostController);

// LIKE POST
router.post("/like/:postId", likePostController);

// UNLIKE POST
router.post("/dislike/:postId", dislikePostController);


module.exports = router;