const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        // If user is a tutor, include tutor-specific information
        const profileData = user.toObject();
        if (user.role === 'Tutor') {
            profileData.tutorInfo = {
                qualifications: user.qualifications,
                hourlyRate: user.hourlyRate,
                totalSessions: user.totalSessions
            };
        }

        res.status(200).json({
            success: true,
            data: profileData
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { fullName, phone, qualifications, hourlyRate } = req.body;

        const user = await User.findById(req.user.id);

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;

        // Only allow tutors to update their specific fields
        if (user.role === 'Tutor') {
            if (qualifications !== undefined) user.qualifications = qualifications;
            if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update password
// @route   PUT /api/profile/me/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (err) {
        next(err);
    }
}; 