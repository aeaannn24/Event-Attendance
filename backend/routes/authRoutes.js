const express = require('express');
const { signupUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
module.exports = router;
