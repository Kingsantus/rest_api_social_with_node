const express = require('express');
const router = express.Router();
const { 
    getUserController,
    updateUserController,
    followUserController,
    unfollowUserController,
    blockUserController,
    unblockUserController,
    getBlockedUsersController,
    deleteUserController,
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


module.exports = router;