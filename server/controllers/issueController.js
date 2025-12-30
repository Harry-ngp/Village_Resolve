const AuditLog = require("../models/auditLog"); // <-- Add this
const Issue = require("../models/issue");
const { cloudinary } = require("../config/cloudinary"); // <-- IMPORT CLOUDINARY

// 🕒 Feature 7: SLA Timings (in hours)
const SLA_HOURS = {
  Water: 24,        // 1 Day
  Electricity: 4,   // 4 Hours (Critical)
  Sanitation: 48,   // 2 Days
  Health: 24,       // 1 Day
  Roads: 168,       // 1 Week
  Education: 72,    // 3 Days
  Other: 120        // 5 Days
};

/**
 * 📝 CREATE ISSUE (With Image Uploads & Duplicate Detection)
 * POST /api/issues
 * Access: Private (Citizen)
 */
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude } = req.body;

    // 1. Validate required fields
    if (!title || !description || !category || !latitude || !longitude) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // 📸 FEATURE 4: HANDLE IMAGE UPLOADS
    // Multer places uploaded files in 'req.files'. We map them to our schema format.
    let imageData = [];
    if (req.files && req.files.length > 0) {
      imageData = req.files.map((file) => ({
        url: file.path,       // Cloudinary URL
        public_id: file.filename // ID for deleting later
      }));
    }

    // 🕵️ FEATURE 5: DUPLICATE DETECTION
    // Check for existing Active issues of the same Category within 50 meters
    const duplicateIssue = await Issue.findOne({
      category,
      status: { $in: ["Submitted", "Under Review", "In Progress"] }, // Only check active issues
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)] // Ensure they are numbers
          },
          $maxDistance: 50 // Distance in meters
        }
      }
    });

    if (duplicateIssue) {
      // ⚠️ CLEANUP: If duplicate found, delete the just-uploaded images to save space
      if (imageData.length > 0) {
        for (const img of imageData) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      return res.status(409).json({
        message: "A similar issue has already been reported nearby.",
        duplicateId: duplicateIssue._id,
        suggestion: "Would you like to upvote the existing issue instead?"
      });
    }

    // 2. Calculate SLA Deadline
    const hours = SLA_HOURS[category] || 72; // Default to 3 days if unknown
    const deadline = new Date(Date.now() + hours * 60 * 60 * 1000);

    // 3. Create the Issue
    const issue = await Issue.create({
      user: req.user._id,        // From authMiddleware
      village: req.user.village, // Auto-linked to user's village
      title,
      description,
      category,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      images: imageData, // Save the array of Cloudinary image objects
      slaDeadline: deadline
    });

    res.status(201).json({
      message: "Issue reported successfully",
      issue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🗺️ GET ALL ISSUES (with filters)
 * GET /api/issues
 * Access: Private (All)
 */
exports.getAllIssues = async (req, res) => {
  try {
    const { status, category } = req.query;
    
    // Default filter: Users only see issues in THEIR village
    const query = { village: req.user.village };

    if (status) query.status = status;
    if (category) query.category = category;

    const issues = await Issue.find(query)
      .populate("user", "name") // Show the name of the person who posted it
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      results: issues.length,
      issues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 👍 UPVOTE ISSUE (Feature 6)
 * PUT /api/issues/:id/upvote
 * Access: Private (Any User)
 */
exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check if user has already upvoted
    const isUpvoted = issue.upvotes.includes(req.user._id);

    if (isUpvoted) {
      // Toggle OFF: Remove user ID from array
      issue.upvotes = issue.upvotes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Toggle ON: Add user ID to array
      issue.upvotes.push(req.user._id);
    }

    await issue.save();

    res.json({
      message: isUpvoted ? "Upvote removed" : "Upvote added",
      upvotes: issue.upvotes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔄 UPDATE ISSUE STATUS (Feature 9)
 * PATCH /api/issues/:id/status
 * Access: Private (Authority, Admin)
 */
/**
 * 🔄 UPDATE ISSUE STATUS (Now with Audit Logging)
 * PATCH /api/issues/:id/status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validation (same as before)
    const validStatuses = ["Submitted", "Under Review", "In Progress", "Resolved", "Verified", "Reopened"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 📝 AUDIT LOGGING: Capture the old status before changing it
    const oldStatus = issue.status;

    // Update the status
    issue.status = status;
    if (status === "In Progress" && !issue.assignedAuthority) {
      issue.assignedAuthority = req.user._id;
    }

    await issue.save();

    // 📝 CREATE AUDIT ENTRY
    // We record WHO changed it and WHAT changed
    await AuditLog.create({
      issue: issue._id,
      user: req.user._id,
      action: "STATUS_CHANGE",
      details: `Changed status from '${oldStatus}' to '${status}'`
    });

    res.json({
      message: `Issue status updated to ${status}`,
      issue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📜 GET ISSUE HISTORY (Audit Logs)
 * GET /api/issues/:id/history
 */
exports.getIssueHistory = async (req, res) => {
  try {
    const logs = await AuditLog.find({ issue: req.params.id })
      .populate("user", "name role") // Show who made the change
      .sort({ createdAt: -1 }); // Newest changes first

    res.json({
      results: logs.length,
      history: logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ VERIFY OR REOPEN ISSUE (Feature 11)
 * POST /api/issues/:id/verify
 * Body: { vote: "verified" } OR { vote: "reopen" }
 */
exports.verifyIssue = async (req, res) => {
  try {
    const { vote } = req.body;
    const { id } = req.params;

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 1. Restriction: Can only verify 'Resolved' issues
    if (issue.status !== "Resolved") {
      return res.status(400).json({ message: "Only resolved issues can be verified." });
    }

    // 2. Remove user from both lists first (to prevent double voting)
    issue.verificationVotes.verified = issue.verificationVotes.verified.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    issue.verificationVotes.reopen = issue.verificationVotes.reopen.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    // 3. Add the new vote
    if (vote === "verified") {
      issue.verificationVotes.verified.push(req.user._id);
    } else if (vote === "reopen") {
      issue.verificationVotes.reopen.push(req.user._id);
    } else {
      return res.status(400).json({ message: "Invalid vote type. Use 'verified' or 'reopen'." });
    }

    // 4. AUTOMATIC ACTION: Check Thresholds
    const verifyCount = issue.verificationVotes.verified.length;
    const reopenCount = issue.verificationVotes.reopen.length;

    // RULE A: If 3+ people say "Reopen", status changes to 'Reopened' (Red Flagged)
    if (reopenCount >= 3) {
        issue.status = "Reopened";
        issue.isRedFlagged = true; // Alert the admin!
        
        // Audit Log (Feature 12)
        await AuditLog.create({
            issue: issue._id,
            user: req.user._id, // The 3rd voter triggers this
            action: "STATUS_CHANGE",
            details: "System auto-reopened issue due to negative community feedback."
        });
    }

    // RULE B: If 5+ people say "Verified", status changes to 'Verified' (Closed permanently)
    else if (verifyCount >= 5) {
        issue.status = "Verified";
        
        await AuditLog.create({
            issue: issue._id,
            user: req.user._id,
            action: "STATUS_CHANGE",
            details: "Issue officially Verified by community consensus."
        });
    }

    await issue.save();

    res.json({
      message: "Vote recorded",
      status: issue.status,
      counts: {
        verified: verifyCount,
        reopen: reopenCount
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};