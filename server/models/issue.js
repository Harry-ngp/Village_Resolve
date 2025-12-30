const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // 👤 Feature 2: Link to the Citizen who reported it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: [true, "Please provide a title for the issue"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"]
    },

    description: {
      type: String,
      required: [true, "Please provide a description"]
    },

    category: {
      type: String,
      required: true,
      enum: ["Water", "Electricity", "Roads", "Sanitation", "Health", "Education", "Other"]
    },

    // 📍 Feature 3 & 5: GeoJSON for "Live GPS" & "Proximity Detection"
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: {
        type: [Number], // Format: [Longitude, Latitude]
        required: [true, "Please provide location coordinates"]
      },
      address: {
        type: String // Optional: Human readable address
      }
    },

    village: {
      type: String,
      required: true, // Inherited from the user automatically
      index: true // Indexed for fast filtering by village
    },

    // 📸 Feature 4: Evidence Media (URLs from Cloudinary/S3)
    images: [
      {
        url: String,
        public_id: String // For deleting from cloud storage later
      }
    ],

    // 🔄 Feature 9: Controlled Lifecycle
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "In Progress", "Resolved", "Verified", "Reopened"],
      default: "Submitted"
    },

    // 👍 Feature 6: Upvote System
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    
    // Feature 11: Verification Logic
    verificationVotes: {
        verified: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // People who say "Yes, it's fixed"
        reopen:   [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]  // People who say "No, it's NOT fixed"
    },
// ...

    // 🕒 Feature 7 & 8: SLA & Red Flags
    slaDeadline: {
      type: Date
    },
    isRedFlagged: {
      type: Boolean,
      default: false
    },
    
    // 💬 Feature 10: One discussion source (Referencing comments if separated, or embedding small logs)
    // We will likely handle full comments in a separate model, but we can track the count here.
    commentCount: {
      type: Number,
      default: 0
    },

    // 🧑‍⚖️ Authority Assignment (Who is working on this?)
    assignedAuthority: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { 
    timestamps: true, // Feature 12: Automates createdAt (Date Reported) and updatedAt 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
  }
  
);

// 🌍 INDEXING: Crucial for Feature 5 (Duplicate Detection) & Feature 15 (Dashboards)
// 1. Geospatial Index: Allows us to find "issues within 500 meters"
issueSchema.index({ location: "2dsphere" });

// 2. Performance Index: Finding issues by Village + Status is the most common query
issueSchema.index({ village: 1, status: 1 });

module.exports = mongoose.model("Issue", issueSchema);