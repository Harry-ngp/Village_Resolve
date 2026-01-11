const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  image: { type: String },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved'], 
    default: 'Open' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- UPDATED SECTIONS (EXISTING) ---
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // --- 🔥 NEW SECTION: RATING (ADD THIS) ---
  rating: {
    score: { type: Number, default: 0 }, // Stores 1-5 stars
    comment: { type: String, default: "" }, // Feedback text
    ratedAt: { type: Date }
  }

}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);