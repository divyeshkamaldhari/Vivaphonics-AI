const express = require('express');
const { check } = require('express-validator');
const { loginLimiter } = require('../middleware/rateLimiter');
const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    check('fullName', 'Full name is required').not().isEmpty(),
    check('role', 'Role is required').isIn(['Admin', 'Tutor'])
], register);

// Verify email route
router.get('/verify/:token', verifyEmail);

// Login route with rate limiting
router.post('/login', loginLimiter, [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], login);

// Forgot password route
router.post('/forgotpassword', [
    check('email', 'Please include a valid email').isEmail()
], forgotPassword);

// Reset password route
router.put('/resetpassword/:token', [
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
], resetPassword);

module.exports = router; 