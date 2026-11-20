const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile
router.get("/profile", protect, getUserProfile);

module.exports = router;