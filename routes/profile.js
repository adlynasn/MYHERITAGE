// Import necessary modules
const express = require("express");
const User = require("./models/userModel"); // Assuming you have a User model

// Create an Express router
const router = express.Router();

// Define the route handler for /user/profile
router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        // Fetch user's profile data from MongoDB based on the user's session
        const userId = req.session.userID; // Assuming you have stored the user ID in the session
        const user = await User.findById(userId); // Assuming you have a User model

        if (user) {
            // Construct the JSON response with the required fields
            const userProfile = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                mobile: user.mobile,
                address: user.address
            };

            // Send the JSON response with the user's profile data
            res.json(userProfile);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching user profile" });
    }
});

// Export the router
module.exports = router;
