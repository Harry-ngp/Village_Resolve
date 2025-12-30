const express = require('express');
const router = express.Router();
const multer = require('multer');
const Report = require('../models/Report');
const auth = require('../middleware/auth'); // Your existing auth middleware

// --- 1. Setup Image Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to 'uploads' folder
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    // Rename file to be unique (timestamp + original name)
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// --- 2. POST Route (Create Report) ---
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // Get text data
    const { title, description, latitude, longitude, address } = req.body;

    // Create new Report in DB
    const newReport = new Report({
      title,
      description,
      location: { 
        latitude, 
        longitude, 
        address 
      },
      // Save image path if it exists
      image: req.file ? `/uploads/${req.file.filename}` : '',
      user: req.user.id // Get User ID from Token
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);

  } catch (err) {
    console.error("Error saving report:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- 3. GET Route (Fetch All Reports) ---
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 }) // Newest first
      .populate('user', 'name'); // Get author's name
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- PATCH: Update Report Status (e.g., Open -> Resolved) ---
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body; // We will send "In Progress" or "Resolved"
    
    // 1. Find the report
    const report = await Report.findById(req.params.id);
    if (!report) {
        return res.status(404).json({ message: 'Report not found' });
    }

    // 2. Update and Save
    report.status = status;
    const updatedReport = await report.save();
    
    res.json(updatedReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
// --- PUT: Toggle Upvote ---
router.put('/:id/upvote', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Check if user has already upvoted
    if (report.upvotes.includes(req.user.id)) {
      // Unlike: Remove user from array
      report.upvotes = report.upvotes.filter(id => id.toString() !== req.user.id);
    } else {
      // Like: Add user to array
      report.upvotes.push(req.user.id);
    }

    await report.save();
    res.json(report.upvotes); // Send back the new list of upvotes
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- POST: Add Comment ---
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      createdAt: new Date()
    };

    report.comments.unshift(newComment); // Add to top of list
    await report.save();

    // Populate user details so we can show the name immediately
    await report.populate('comments.user', 'name');
    
    res.json(report.comments); // Send back updated comments
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
module.exports = router;