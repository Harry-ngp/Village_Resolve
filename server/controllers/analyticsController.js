const Issue = require("../models/issue");

/**
 * 📊 GET DASHBOARD ANALYTICS
 * GET /api/analytics
 * Access: Private (Admin, Authority)
 */
exports.getAnalytics = async (req, res) => {
  try {
    // Filter: If user is an Admin, they might see ALL data.
    // If Authority, they see data for their assigned Village.
    const matchStage = { village: req.user.village };

    const stats = await Issue.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalIssues: { $sum: 1 },
          resolvedIssues: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
          },
          pendingIssues: {
            $sum: { 
              $cond: [{ $in: ["$status", ["Submitted", "Under Review", "In Progress"]] }, 1, 0] 
            }
          },
          redFlaggedIssues: {
            $sum: { $cond: [{ $eq: ["$isRedFlagged", true] }, 1, 0] }
          }
        }
      }
    ]);

    // Breakdown by Category (e.g., Water: 5, Roads: 2)
    const categoryStats = await Issue.aggregate([
      { $match: matchStage },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Default values if no data exists
    const data = stats[0] || {
      totalIssues: 0,
      resolvedIssues: 0,
      pendingIssues: 0,
      redFlaggedIssues: 0
    };

    res.json({
      summary: data,
      byCategory: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};