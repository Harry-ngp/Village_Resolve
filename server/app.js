const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const startSLAChecker = require("./jobs/slaChecker"); // Feature 8: Background Job
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const commentRoutes = require("./routes/commentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes"); // <-- 1. NEW IMPORT


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/analytics", analyticsRoutes); // <-- 2. NEW ROUTE MOUNTED
// 1. Allow the frontend to view uploaded images
app.use('/uploads', express.static('uploads')); 
// 2. Use the reports route
app.use('/api/reports', require('./routes/reports'));

// Test route
app.get("/", (req, res) => {
  res.send("VillageResolve Backend Running 🚀");
});

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    // Start the SLA Checker
    startSLAChecker();
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});