import asyncHandler from 'express-async-handler';
import Session from '../models/sessionModel.js';
import User from '../models/userModel.js';
import { format } from 'date-fns';

// @desc    Calculate payments for a date range
// @route   GET /api/payments/calculate
// @access  Private/Admin
export const calculatePayments = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Find all completed sessions within the date range
    const sessions = await Session.find({
        status: 'Completed',
        date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }).populate('tutor', 'name hourlyRate');

    // Group sessions by tutor and calculate total hours and payment
    const payments = sessions.reduce((acc, session) => {
        const tutorId = session.tutor._id.toString();
        const hours = (session.endTime - session.startTime) / (1000 * 60 * 60);

        if (!acc[tutorId]) {
            acc[tutorId] = {
                tutor: session.tutor,
                totalHours: 0,
                totalPayment: 0,
                sessions: []
            };
        }

        acc[tutorId].totalHours += hours;
        acc[tutorId].totalPayment += hours * session.tutor.hourlyRate;
        acc[tutorId].sessions.push(session);

        return acc;
    }, {});

    res.json(Object.values(payments));
});

// @desc    Generate payment report
// @route   GET /api/payments/report
// @access  Private/Admin
export const generatePaymentReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Find all completed sessions within the date range
    const sessions = await Session.find({
        status: 'Completed',
        date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }).populate('tutor', 'name hourlyRate');

    // Generate CSV content
    let csvContent = 'Tutor,Date,Start Time,End Time,Hours,Rate,Payment\n';

    sessions.forEach(session => {
        const hours = (session.endTime - session.startTime) / (1000 * 60 * 60);
        const payment = hours * session.tutor.hourlyRate;

        csvContent += `${session.tutor.name},${format(session.date, 'yyyy-MM-dd')},${format(session.startTime, 'HH:mm')},${format(session.endTime, 'HH:mm')},${hours.toFixed(2)},${session.tutor.hourlyRate},${payment.toFixed(2)}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=payment-report-${startDate}-to-${endDate}.csv`);
    res.send(csvContent);
});

// @desc    Get tutor payment history
// @route   GET /api/payments/tutor/:tutorId
// @access  Private
export const getTutorPaymentHistory = asyncHandler(async (req, res) => {
    const { tutorId } = req.params;
    const { startDate, endDate } = req.query;

    // Check if the user is the tutor or an admin
    if (req.user.role !== 'Admin' && req.user._id.toString() !== tutorId) {
        res.status(403);
        throw new Error('Not authorized to view this payment history');
    }

    // Find all completed sessions for the tutor within the date range
    const sessions = await Session.find({
        tutor: tutorId,
        status: 'Completed',
        date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }).populate('tutor', 'name hourlyRate');

    // Calculate total hours and payment
    const totalHours = sessions.reduce((acc, session) => {
        const hours = (session.endTime - session.startTime) / (1000 * 60 * 60);
        return acc + hours;
    }, 0);

    const totalPayment = totalHours * sessions[0]?.tutor?.hourlyRate || 0;

    res.json({
        tutor: sessions[0]?.tutor,
        totalHours,
        totalPayment,
        sessions
    });
});

// @desc    Update tutor rate
// @route   PUT /api/payments/tutor/:tutorId/rate
// @access  Private/Admin
export const updateTutorRate = asyncHandler(async (req, res) => {
    const { tutorId } = req.params;
    const { hourlyRate } = req.body;

    const tutor = await User.findById(tutorId);

    if (!tutor) {
        res.status(404);
        throw new Error('Tutor not found');
    }

    if (tutor.role !== 'Tutor') {
        res.status(400);
        throw new Error('User is not a tutor');
    }

    tutor.hourlyRate = hourlyRate;
    await tutor.save();

    res.json({
        _id: tutor._id,
        name: tutor.name,
        hourlyRate: tutor.hourlyRate
    });
}); 