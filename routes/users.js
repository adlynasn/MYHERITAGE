const express = require("express");
const router = express.Router();
const { createUser, getUser } = require("../controller/userCtrl"); // Ensure getUser is imported

// Route to create a new user
router.post("/register", createUser);

// Route to get user data by user ID
router.get("/getUser/:userID", getUser);

module.exports = router;
