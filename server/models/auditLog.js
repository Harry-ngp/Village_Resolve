const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ["STATUS_CHANGE", "SLA_BREACH", "PRIORITY_CHANGE", "ASSIGNMENT"]
  },
  details: {
    type: String, // e.g., "Changed status from Submitted to In Progress"
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);