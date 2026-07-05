const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
