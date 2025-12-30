const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    village: { type: String, required: true },
    role: {
      type: String,
      // We allow all variations to be safe
      enum: ["citizen", "villager", "authority", "admin", "Citizen", "Villager"],
      default: "villager",
    },
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ---------------------------------------------------------
// ✅ FIX 1: Remove 'next' parameter. Use async/await only.
// ---------------------------------------------------------
userSchema.pre("save", async function () {
  // If password is not changed, stop here.
  if (!this.isModified("password")) {
    return;
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match Password Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ---------------------------------------------------------
// ✅ FIX 2: Prevent OverwriteModelError
// ---------------------------------------------------------
module.exports = mongoose.models.User || mongoose.model("User", userSchema);