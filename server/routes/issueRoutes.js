const express = require("express");
const { 
  createIssue, 
  getAllIssues, 
  upvoteIssue,
  updateStatus,
  getIssueHistory // <-- 1. Import new function
} = require("../controllers/issueController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");
const { 
  // ... existing imports
  verifyIssue // <-- Import the new function
} = require("../controllers/issueController");
const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(upload.array("images", 5), createIssue)
  .get(getAllIssues);

router.put("/:id/upvote", upvoteIssue);

// 2. Add History Route
// Any logged-in user can see the history of an issue (Transparency!)
router.get("/:id/history", getIssueHistory);

router.patch(
  "/:id/status", 
  restrictTo("authority", "admin"), 
  updateStatus
);
// ... existing routes
// Feature 11: Community Verification Route
router.post("/:id/verify", verifyIssue);

module.exports = router;
