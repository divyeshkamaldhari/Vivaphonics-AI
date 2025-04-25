const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
    getProfile,
    updateProfile,
    updatePassword
} = require('../controllers/profileController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get current user profile
router.get('/me', getProfile);

// Update profile
router.put('/me', [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('phone', 'Please include a valid phone number').optional().isMobilePhone(),
    check('qualifications', 'Qualifications must be a string').optional().isString(),
    check('hourlyRate', 'Hourly rate must be a positive number').optional().isFloat({ min: 0 })
], updateProfile);

// Update password
router.put('/me/password', [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be at least 8 characters long').isLength({ min: 8 })
], updatePassword);

module.exports = router; 