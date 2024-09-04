#!/usr/bin/env node
// Authentication route for users
const express = require("express");
const { registerContoller, loginController, logoutController, refetchUserController } = require("../controllers/authController");
const router = express.Router();


// REGISTRATION
router.post("/register", registerContoller);

// LOGIN
router.post("/login", loginController);

// LOGOUT
router.get("/logout", logoutController);

// FETCH CURRENT USER
router.get("/refetch", refetchUserController);

module.exports = router;