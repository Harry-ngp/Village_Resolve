const express = require("express");
// 👇 These names MUST match the exports in authController.js
const { register, verifyOtp, login, getMe } = require("../controllers/authController");
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

module.exports = router;