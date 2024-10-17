const express = require('express');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Get all users (Admin only)
router.get('/users', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  const users = await User.find();
  res.json(users);
});

// Search users (Admin only)
router.get('/users/search', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  const searchQuery = req.query.username;
  const users = await User.find({ username: { $regex: searchQuery, $options: 'i' } });
  res.json(users);
});

// Delete user (Admin only)
router.delete('/users/:id', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted successfully' });
});

// Update user (Admin only)
router.put('/users/:id', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

module.exports = router;
