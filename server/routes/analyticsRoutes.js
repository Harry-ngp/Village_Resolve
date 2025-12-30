const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect: Login required
router.use(protect);

// Restrict: Only Admins and Authorities can view analytics
router.get("/", restrictTo("admin", "authority"), getAnalytics);

module.exports = router;