const express = require("express");
// 👇 Added 'updateDetails' to the imports
const { register, verifyOtp, login, getMe, updateDetails } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register (Send OTP)
router.post("/register", register);

// Verify OTP (Get Token)
router.post("/verify-otp", verifyOtp);

// Login (Get Token)
router.post("/login", login);

// Get Current User
router.get("/me", protect, getMe);

// Update Profile (Name & Village) 👈 NEW ROUTE
router.put("/update", protect, updateDetails);

module.exports = router;