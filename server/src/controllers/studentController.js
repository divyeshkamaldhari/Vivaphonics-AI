import asyncHandler from 'express-async-handler';
import Student from '../models/studentModel.js';
import User from '../models/userModel.js';
import { ROLES } from '../config/constants.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
export const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({}).populate('tutor', 'name email');
    res.json(students);
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin
export const getStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('tutor', 'name email');
    
    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Create student
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = asyncHandler(async (req, res) => {
    const { name, email, phone, status, tutorId, notes } = req.body;

    // Check if student with email already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
        res.status(400);
        throw new Error('Student with this email already exists');
    }

    // If tutor is specified, verify they exist and are a tutor
    if (tutorId) {
        const tutor = await User.findById(tutorId);
        if (!tutor || tutor.role !== ROLES.TUTOR) {
            res.status(400);
            throw new Error('Invalid tutor ID');
        }
    }

    const student = await Student.create({
        name,
        email,
        phone,
        status,
        tutor: tutorId,
        notes
    });

    if (student) {
        res.status(201).json(student);
    } else {
        res.status(400);
        throw new Error('Invalid student data');
    }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Check if email is being changed and if it's already in use
    if (req.body.email && req.body.email !== student.email) {
        const emailExists = await Student.findOne({ email: req.body.email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already in use');
        }
    }

    // If tutor is being updated, verify they exist and are a tutor
    if (req.body.tutorId) {
        const tutor = await User.findById(req.body.tutorId);
        if (!tutor || tutor.role !== ROLES.TUTOR) {
            res.status(400);
            throw new Error('Invalid tutor ID');
        }
    }

    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.phone = req.body.phone || student.phone;
    student.status = req.body.status || student.status;
    student.tutor = req.body.tutorId || student.tutor;
    student.notes = req.body.notes || student.notes;

    const updatedStudent = await student.save();
    res.json(await updatedStudent.populate('tutor', 'name email'));
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    await student.deleteOne();
    res.json({ message: 'Student removed' });
});

// @desc    Assign tutor to student
// @route   PUT /api/students/:id/assign-tutor
// @access  Private/Admin
export const assignTutor = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Verify tutor exists and is a tutor
    const tutor = await User.findById(req.body.tutorId);
    if (!tutor || tutor.role !== ROLES.TUTOR) {
        res.status(400);
        throw new Error('Invalid tutor ID');
    }

    student.tutor = req.body.tutorId;
    const updatedStudent = await student.save();
    res.json(await updatedStudent.populate('tutor', 'name email'));
}); 