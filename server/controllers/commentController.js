const Comment = require("../models/comment");
const Issue = require("../models/issue");

/**
 * 💬 ADD COMMENT
 * POST /api/comments/:issueId
 */
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { issueId } = req.params;

    // 1. Check if the issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 2. Create the Comment
    const comment = await Comment.create({
      issue: issueId,
      user: req.user._id,
      text,
      isOfficial: req.user.role === "authority" || req.user.role === "admin"
    });

    // 3. OPTIMIZATION: Increment comment count on the Issue model
    // This allows us to show "5 Comments" on the dashboard instantly
    issue.commentCount = (issue.commentCount || 0) + 1;
    await issue.save();

    // 4. Return the comment with user details populated
    const populatedComment = await Comment.findById(comment._id).populate("user", "name role");

    res.status(201).json({
      message: "Comment added",
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📜 GET COMMENTS FOR AN ISSUE
 * GET /api/comments/:issueId
 */
exports.getCommentsByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const comments = await Comment.find({ issue: issueId })
      .populate("user", "name role") // Get name and role of commenter
      .sort({ createdAt: 1 }); // Oldest first (like a chat history)

    res.json({
      results: comments.length,
      comments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};