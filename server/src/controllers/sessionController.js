import asyncHandler from 'express-async-handler';
import Session from '../models/sessionModel.js';
import Student from '../models/studentModel.js';
import User from '../models/userModel.js';
import { SESSION_STATUS } from '../config/constants.js';

// Helper function to check for schedule conflicts
const checkScheduleConflict = async (tutorId, date, startTime, endTime, excludeSessionId = null) => {
    const query = {
        tutor: tutorId,
        date: date,
        status: { $ne: SESSION_STATUS.CANCELLED },
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    };

    if (excludeSessionId) {
        query._id = { $ne: excludeSessionId };
    }

    return await Session.findOne(query);
};

// Helper function to generate recurring sessions
const generateRecurringSessions = async (sessionData) => {
    const sessions = [];
    const { date, startTime, endTime, recurringPattern } = sessionData;
    const startDate = new Date(date);
    const endDate = new Date(recurringPattern.endDate);

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        if (recurringPattern.daysOfWeek.includes(currentDate.getDay())) {
            const session = new Session({
                ...sessionData,
                date: new Date(currentDate),
                _id: undefined
            });
            sessions.push(session);
        }

        // Move to next week or biweekly
        currentDate.setDate(currentDate.getDate() + (recurringPattern.frequency === 'weekly' ? 7 : 14));
    }

    return sessions;
};

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private
export const getSessions = asyncHandler(async (req, res) => {
    const { startDate, endDate, tutor, student, status } = req.query;
    
    // Build query
    const query = {};
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (tutor) query.tutor = tutor;
    if (student) query.student = student;
    if (status) query.status = status;

    const sessions = await Session.find(query)
        .populate('student', 'name email')
        .populate('tutor', 'name email')
        .sort('date startTime');

    res.json(sessions);
});

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
export const getSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id)
        .populate('student', 'name email')
        .populate('tutor', 'name email');

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    res.json(session);
});

// @desc    Create session
// @route   POST /api/sessions
// @access  Private/Admin
export const createSession = asyncHandler(async (req, res) => {
    // Check if student and tutor exist
    const [student, tutor] = await Promise.all([
        Student.findById(req.body.student),
        User.findById(req.body.tutor)
    ]);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    if (!tutor || tutor.role !== 'Tutor') {
        res.status(404);
        throw new Error('Tutor not found or is not a tutor');
    }

    // Check for schedule conflicts
    const conflict = await checkScheduleConflict(
        req.body.tutor,
        req.body.date,
        req.body.startTime,
        req.body.endTime
    );

    if (conflict) {
        res.status(400);
        throw new Error('Schedule conflict detected');
    }

    let session;
    if (req.body.isRecurring) {
        const sessions = await generateRecurringSessions(req.body);
        session = await Session.create(sessions);
    } else {
        session = await Session.create(req.body);
    }

    res.status(201).json(session);
});

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private/Admin
export const updateSession = asyncHandler(async (req, res) => {
    let session = await Session.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    // Check for schedule conflicts if time is being updated
    if (req.body.startTime || req.body.endTime || req.body.date) {
        const conflict = await checkScheduleConflict(
            session.tutor,
            req.body.date || session.date,
            req.body.startTime || session.startTime,
            req.body.endTime || session.endTime,
            session._id
        );

        if (conflict) {
            res.status(400);
            throw new Error('Schedule conflict detected');
        }
    }

    // Update session
    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('student', 'name email')
      .populate('tutor', 'name email');

    res.json(session);
});

// @desc    Cancel session
// @route   DELETE /api/sessions/:id
// @access  Private/Admin
export const cancelSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    session.status = SESSION_STATUS.CANCELLED;
    session.cancellationReason = req.body.reason;
    session.cancelledAt = Date.now();
    session.cancelledBy = req.user._id;

    await session.save();

    res.json({ message: 'Session cancelled' });
});

// @desc    Update session status
// @route   PUT /api/sessions/:id/status
// @access  Private
export const updateSessionStatus = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    // Validate status transition
    const validTransitions = {
        [SESSION_STATUS.SCHEDULED]: [SESSION_STATUS.IN_PROGRESS, SESSION_STATUS.CANCELLED],
        [SESSION_STATUS.IN_PROGRESS]: [SESSION_STATUS.COMPLETED, SESSION_STATUS.PAUSED],
        [SESSION_STATUS.PAUSED]: [SESSION_STATUS.IN_PROGRESS, SESSION_STATUS.COMPLETED]
    };

    if (!validTransitions[session.status]?.includes(req.body.status)) {
        res.status(400);
        throw new Error(`Invalid status transition from ${session.status} to ${req.body.status}`);
    }

    session.status = req.body.status;
    await session.save();

    res.json(session);
});

// Get sessions for calendar view
const getCalendarSessions = async (req, res) => {
    try {
        const { startDate, endDate, tutor, student } = req.query;
        
        // Build query
        const query = {};
        
        // Add date range filter
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        // Add tutor filter
        if (tutor) {
            query.tutor = tutor;
        }
        
        // Add student filter
        if (student) {
            query.student = student;
        }
        
        // Get sessions with populated student and tutor details
        const sessions = await Session.find(query)
            .populate('student', 'full_name')
            .populate('tutor', 'full_name')
            .sort({ date: 1, startTime: 1 });
        
        // Format sessions for calendar
        const calendarSessions = sessions.map(session => ({
            id: session._id,
            title: `${session.student.full_name} with ${session.tutor.full_name}`,
            start: new Date(`${session.date.toISOString().split('T')[0]}T${session.startTime}`),
            end: new Date(`${session.date.toISOString().split('T')[0]}T${session.endTime}`),
            status: session.status,
            student: session.student.full_name,
            tutor: session.tutor.full_name,
            duration: session.duration
        }));
        
        res.status(200).json({
            success: true,
            data: calendarSessions
        });
    } catch (error) {
        console.error('Error fetching calendar sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching calendar sessions'
        });
    }
};

export { getCalendarSessions }; 