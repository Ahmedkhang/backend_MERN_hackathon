const express = require('express');
const router = express.Router();
const register = require('../controllers/registerController');
const login = require('../controllers/loginController');
const protect = require('../middleware/protect');
const checkRole = require('../middleware/checkRole');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route example (only for authenticated users)
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'This is your profile', userId: req.user.userId });
});

// Admin only route example
router.get('/admin', protect, checkRole('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!', userId: req.user.userId });
});

module.exports = router;
