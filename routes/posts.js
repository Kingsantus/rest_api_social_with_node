const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
    createPostController,
    createPostWithImageController,
    updatePostController,
} = require('../controllers/postController');


// CREATE POST
router.post("/create", createPostController);

// CREATE POST WITH IMAGE
// upload.array indicate images to be uploaded and it should be maximum of five
router.post("/create/:userId", upload.array("images",5),createPostWithImageController);

// UPDATE POST
router.put("/update/:postId", updatePostController);


module.exports = router;