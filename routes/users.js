const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { 
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
} = require('../controllers/userController');

// GET USER
router.get("/:userId", getUserController);

// UPDATE USER
router.put("/update/:userId", updateUserController);

// FOLLOW USER
router.post("/follow/:userId", followUserController);

// UNFOLLOW USER
router.post("/unfollow/:userId", unfollowUserController);

// BLOCK USER
router.post("/block/:userId", blockUserController);

// UNBLOCK USER
router.post("/unblock/:userId", unblockUserController);

// GET BLOCKED USERS
router.get("/blocked/:userId", getBlockedUsersController);

// DELETE USER 
router.delete("/delete/:userId", deleteUserController);

// SEARCH USER
router.get("/search/:query", searchUserController);

// UPDATE PROFILE PICTURE
// upload.single("profilePicture") changes the name of the file to profilePicture
router.put(
    "/update-profile-picture/:userId",
    upload.single("profilePicture"),
    uploadProfilePictureController
)

// UPDATE COVER PICTURE
router.put(
    "/update-cover-picture/:userId",
    upload.single("coverPicture"),
    uploadCoverPictureController
)

module.exports = router;