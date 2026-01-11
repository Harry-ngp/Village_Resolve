const User = require("../models/User"); // Ensure filename matches your model
const bcrypt = require("bcryptjs");
const emailjs = require("@emailjs/nodejs");
const jwt = require("jsonwebtoken");

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// --- 1. REGISTER USER & SEND OTP ---
const register = async (req, res) => {
  try {
    const { name, email, password, village, role } = req.body;

    if (!name || !email || !password || !village) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create User (isVerified: false)
    // Note: We are passing password directly assuming your User model has a pre-save hook to hash it.
    // If not, uncomment the manual hashing lines below.
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password, 
      village,
      role: role || "citizen",
      otp,
      otpExpires,
      isVerified: false 
    });

    // Send OTP email using EmailJS
    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        { email: user.email, passcode: otp, time: "10 minutes" },
        { publicKey: process.env.EMAILJS_PUBLIC_KEY }
      );
    } catch (emailError) {
      console.error("EmailJS Error:", emailError);
      // We continue even if email fails so you can test via console logs
    }

    console.log(`DEBUG OTP for ${email}: ${otp}`); // Remove in production

    res.status(201).json({
      message: "OTP sent to your email. Please verify.",
      email: user.email,
      userId: user._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// --- 2. VERIFY OTP ---
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ 
        message: "User already verified",
        token: generateToken(user._id),
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        village: user.village
      });
    }

    // Check OTP match and expiry
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Success: Verify user and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      message: "Email verified successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      village: user.village,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. LOGIN USER ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check Verification Status
    if (!user.isVerified) {
       return res.status(403).json({ message: "Please verify your email first." });
    }

    // Check Password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      village: user.village,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// --- 4. GET CURRENT USER ---
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 5. UPDATE USER DETAILS ---
const updateDetails = async (req, res) => {
  try {
    const { name, village } = req.body;

    // req.user.id comes from the 'protect' middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (village) user.village = village;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      village: user.village,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- EXPORT ALL FUNCTIONS ---
module.exports = {
  register,
  verifyOtp,
  login,
  getMe,
  updateDetails, 
};