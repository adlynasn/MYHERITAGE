const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Create a new user
const createUser = asyncHandler(async (req, res) => {
    try {
        const email = req.body.email;
        const findUser = await User.findOne({ email });

        if (!findUser) {
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } else {
            res.status(400).json({
                msg: "User already exists",
                success: false,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user");
    }
});

// Get user by ID
const getUser = asyncHandler(async (req, res) => {
    try {
        const userID = req.params.userID;
        const user = await User.findById(userID);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching user");
    }
});

module.exports = { createUser, getUser };