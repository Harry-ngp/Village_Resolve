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
  
  // --- UPDATED SECTIONS ---
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User IDs
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who commented?
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);