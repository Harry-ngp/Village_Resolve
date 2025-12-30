const express = require("express");
const { addComment, getCommentsByIssue } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all comment routes (User must be logged in)
router.use(protect);

// Route structure: /api/comments/:issueId
router
  .route("/:issueId")
  .get(getCommentsByIssue) // Read comments
  .post(addComment);       // Post a comment

module.exports = router;