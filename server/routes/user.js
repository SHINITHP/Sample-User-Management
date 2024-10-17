const express = require('express');
const multer = require('multer');
const verifyToken = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Profile image upload route
router.post('/upload', verifyToken, upload.single('profileImage'), async (req, res) => {
  const user = await User.findById(req.user.id);
  user.profileImage = req.file.filename;
  await user.save();
  res.json({ message: 'Profile image uploaded successfully', profileImage: req.file.filename });
});

module.exports = router;
