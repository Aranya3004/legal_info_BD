const express = require('express');
const router = express.Router();

// Import the controller functions
const { register, login, getMe } = require('../controllers/authController');

// Import the auth middleware
const { verifyToken } = require('../middleware/auth');

// Define the routes:
// POST /api/auth/register → calls the register function
router.post('/register', register);

// POST /api/auth/login → calls the login function
router.post('/login', login);

// GET /api/auth/me → verifyToken runs first, then getMe
// If verifyToken rejects, getMe never runs
router.get('/me', verifyToken, getMe);

module.exports = router;