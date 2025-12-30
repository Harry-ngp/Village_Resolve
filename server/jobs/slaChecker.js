const cron = require("node-cron");
const Issue = require("../models/issue");

const startSLAChecker = () => {
  // Schedule the task to run every hour at minute 0 (e.g., 1:00, 2:00, 3:00)
  // Cron syntax: "0 * * * *" means "At minute 0 past every hour"
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Running SLA Check...");

    try {
      const now = new Date();

      // Find issues that:
      // 1. Are NOT resolved yet
      // 2. Have passed their deadline
      // 3. Are NOT already flagged (to avoid re-updating)
      const overdueIssues = await Issue.updateMany(
        {
          status: { $in: ["Submitted", "Under Review", "In Progress"] },
          slaDeadline: { $lt: now },
          isRedFlagged: false 
        },
        {
          $set: { isRedFlagged: true }
        }
      );

      if (overdueIssues.modifiedCount > 0) {
        console.log(`⚠️ Red-Flagged ${overdueIssues.modifiedCount} overdue issues.`);
        
        // FUTURE ENHANCEMENT: Send email to Admin/Authority here using EmailJS
        // "Alert: 5 Issues in 'Nagpur Village' are overdue!"
      } else {
        console.log("✅ No new overdue issues found.");
      }
    } catch (error) {
      console.error("❌ SLA Check Error:", error);
    }
  });
};

module.exports = startSLAChecker;