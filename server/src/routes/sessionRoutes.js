import express from 'express';
import {
    getSessions,
    getSession,
    createSession,
    updateSession,
    cancelSession,
    updateSessionStatus
} from '../controllers/sessionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const validateSession = (req, res, next) => {
    const { student, tutor, date, startTime, endTime, isRecurring, recurringPattern } = req.body;

    if (!student || !tutor || !date || !startTime || !endTime) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid time format. Use HH:mm'
        });
    }

    // Validate recurring session pattern
    if (isRecurring && recurringPattern) {
        const { frequency, endDate, daysOfWeek } = recurringPattern;
        
        if (!frequency || !endDate || !daysOfWeek) {
            return res.status(400).json({
                success: false,
                message: 'Recurring pattern requires frequency, endDate, and daysOfWeek'
            });
        }

        if (!['weekly', 'biweekly'].includes(frequency)) {
            return res.status(400).json({
                success: false,
                message: 'Frequency must be either weekly or biweekly'
            });
        }

        if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'daysOfWeek must be a non-empty array'
            });
        }

        // Validate days are numbers between 0-6
        if (!daysOfWeek.every(day => Number.isInteger(day) && day >= 0 && day <= 6)) {
            return res.status(400).json({
                success: false,
                message: 'Days must be numbers between 0-6 (0=Sunday, 6=Saturday)'
            });
        }
    }

    next();
};

router.route('/')
    .get(protect, getSessions)
    .post(protect, admin, validateSession, createSession);

router.route('/:id')
    .get(protect, getSession)
    .put(protect, admin, validateSession, updateSession)
    .delete(protect, admin, cancelSession);

router.route('/:id/status')
    .put(protect, updateSessionStatus);

export default router; 