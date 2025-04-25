import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    calculatePayments,
    generatePaymentReport,
    getTutorPaymentHistory,
    updateTutorRate
} from '../controllers/paymentController.js';

const router = express.Router();

// Validation middleware
const validatePaymentQuery = (req, res, next) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: 'Please provide startDate and endDate'
        });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid date format. Use YYYY-MM-DD'
        });
    }

    next();
};

// Calculate payments for a date range
router.get('/calculate', protect, admin, calculatePayments);

// Generate payment report
router.get('/report', protect, admin, generatePaymentReport);

// Get tutor payment history
router.get('/tutor/:tutorId', protect, getTutorPaymentHistory);

// Update tutor rate
router.put('/tutor/:tutorId/rate', protect, admin, updateTutorRate);

export default router; 