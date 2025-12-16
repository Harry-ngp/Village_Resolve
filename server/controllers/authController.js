const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, village } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      village,
      verificationToken
    });

    // 🔔 EmailJS will be triggered from frontend
    res.status(201).json({
      message: "User registered. Please verify your email.",
      userId: user._id,
      verificationToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
