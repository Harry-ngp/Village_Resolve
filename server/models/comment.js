const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // Link to the specific Issue
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true
    },
    // Link to the User who wrote the comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // The actual comment text
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true
    },
    // Optional: Is this an "Official" update from authority?
    isOfficial: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true } // Auto-creates createdAt and updatedAt
);

module.exports = mongoose.model("Comment", commentSchema);