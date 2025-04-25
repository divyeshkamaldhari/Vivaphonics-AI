import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc    Get all tutors
// @route   GET /api/tutors
// @access  Private/Admin
export const getTutors = asyncHandler(async (req, res) => {
    const tutors = await User.find({ role: 'Tutor' }).select('-password');
    res.json(tutors);
});

// @desc    Get single tutor
// @route   GET /api/tutors/:id
// @access  Private/Admin
export const getTutor = asyncHandler(async (req, res) => {
    const tutor = await User.findById(req.params.id).select('-password');
    
    if (tutor && tutor.role === 'Tutor') {
        res.json(tutor);
    } else {
        res.status(404);
        throw new Error('Tutor not found');
    }
});

// @desc    Create tutor
// @route   POST /api/tutors
// @access  Private/Admin
export const createTutor = asyncHandler(async (req, res) => {
    const { name, email, password, hourlyRate, subjects, availability } = req.body;

    const tutorExists = await User.findOne({ email });

    if (tutorExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const tutor = await User.create({
        name,
        email,
        password,
        role: 'Tutor',
        hourlyRate,
        subjects,
        availability
    });

    if (tutor) {
        res.status(201).json({
            _id: tutor._id,
            name: tutor.name,
            email: tutor.email,
            role: tutor.role,
            hourlyRate: tutor.hourlyRate,
            subjects: tutor.subjects,
            availability: tutor.availability
        });
    } else {
        res.status(400);
        throw new Error('Invalid tutor data');
    }
});

// @desc    Update tutor
// @route   PUT /api/tutors/:id
// @access  Private/Admin
export const updateTutor = asyncHandler(async (req, res) => {
    const tutor = await User.findById(req.params.id);

    if (tutor && tutor.role === 'Tutor') {
        tutor.name = req.body.name || tutor.name;
        tutor.email = req.body.email || tutor.email;
        tutor.hourlyRate = req.body.hourlyRate || tutor.hourlyRate;
        tutor.subjects = req.body.subjects || tutor.subjects;
        tutor.availability = req.body.availability || tutor.availability;

        if (req.body.password) {
            tutor.password = req.body.password;
        }

        const updatedTutor = await tutor.save();

        res.json({
            _id: updatedTutor._id,
            name: updatedTutor.name,
            email: updatedTutor.email,
            role: updatedTutor.role,
            hourlyRate: updatedTutor.hourlyRate,
            subjects: updatedTutor.subjects,
            availability: updatedTutor.availability
        });
    } else {
        res.status(404);
        throw new Error('Tutor not found');
    }
});

// @desc    Delete tutor
// @route   DELETE /api/tutors/:id
// @access  Private/Admin
export const deleteTutor = asyncHandler(async (req, res) => {
    const tutor = await User.findById(req.params.id);

    if (tutor && tutor.role === 'Tutor') {
        await tutor.deleteOne();
        res.json({ message: 'Tutor removed' });
    } else {
        res.status(404);
        throw new Error('Tutor not found');
    }
});

// @desc    Update tutor availability
// @route   PUT /api/tutors/:id/availability
// @access  Private/Admin
export const updateTutorAvailability = asyncHandler(async (req, res) => {
    const tutor = await User.findById(req.params.id);

    if (tutor && tutor.role === 'Tutor') {
        tutor.availability = req.body.availability;
        const updatedTutor = await tutor.save();
        res.json(updatedTutor);
    } else {
        res.status(404);
        throw new Error('Tutor not found');
    }
}); 