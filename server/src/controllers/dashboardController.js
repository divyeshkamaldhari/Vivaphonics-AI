import asyncHandler from 'express-async-handler';
import Session from '../models/sessionModel.js';
import Student from '../models/studentModel.js';
import User from '../models/userModel.js';
import { subDays, startOfDay, endOfDay } from 'date-fns';

// @desc    Get dashboard metrics and visualizations
// @route   GET /api/dashboard
// @access  Private/Admin
export const getDashboardData = asyncHandler(async (req, res) => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // Get active students count
    const activeStudents = await Student.countDocuments({ status: 'Active' });

    // Get upcoming sessions (next 7 days)
    const upcomingSessions = await Session.find({
        date: {
            $gte: startOfDay(today),
            $lte: endOfDay(sevenDaysFromNow)
        },
        status: 'Scheduled'
    }).populate('student', 'name')
      .populate('tutor', 'name');

    // Get sessions for the current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlySessions = await Session.find({
        date: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth
        },
        status: 'Completed'
    }).populate('tutor', 'name hourlyRate');

    // Calculate total payments due for the month
    const totalPaymentsDue = monthlySessions.reduce((total, session) => {
        const hours = (session.endTime - session.startTime) / (1000 * 60 * 60);
        return total + (hours * session.tutor.hourlyRate);
    }, 0);

    // Get sessions per week for the last 4 weeks
    const sessionsPerWeek = [];
    for (let i = 3; i >= 0; i--) {
        const weekStart = subDays(today, i * 7);
        const weekEnd = subDays(today, (i - 1) * 7);

        const weekSessions = await Session.countDocuments({
            date: {
                $gte: startOfDay(weekStart),
                $lte: endOfDay(weekEnd)
            }
        });

        sessionsPerWeek.push({
            week: weekStart.toISOString().split('T')[0],
            count: weekSessions
        });
    }

    // Get sessions by status
    const sessionsByStatus = await Session.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    res.json({
        metrics: {
            activeStudents,
            upcomingSessions: upcomingSessions.length,
            totalPaymentsDue
        },
        charts: {
            sessionsPerWeek,
            sessionsByStatus: sessionsByStatus.map(status => ({
                status: status._id,
                count: status.count
            }))
        },
        upcomingSessions: upcomingSessions.map(session => ({
            id: session._id,
            date: session.date,
            startTime: session.startTime,
            endTime: session.endTime,
            student: session.student.name,
            tutor: session.tutor.name
        }))
    });
}); 