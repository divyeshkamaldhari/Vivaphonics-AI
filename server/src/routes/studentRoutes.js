import express from 'express';
import { check } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';
import {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    assignTutor
} from '../controllers/studentController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes that require admin or tutor role
router.get('/', authorize(ROLES.ADMIN, ROLES.TUTOR), getStudents);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.TUTOR), getStudent);

// Routes that require admin role only
router.post('/', [
    authorize(ROLES.ADMIN),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Please include a valid phone number').optional().isMobilePhone(),
    check('status', 'Status must be Active, Inactive, or Paused').optional().isIn(['Active', 'Inactive', 'Paused'])
], createStudent);

router.put('/:id', [
    authorize(ROLES.ADMIN),
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('phone', 'Please include a valid phone number').optional().isMobilePhone(),
    check('status', 'Status must be Active, Inactive, or Paused').optional().isIn(['Active', 'Inactive', 'Paused'])
], updateStudent);

router.delete('/:id', authorize(ROLES.ADMIN), deleteStudent);

router.put('/:id/assign-tutor', [
    authorize(ROLES.ADMIN),
    check('tutorId', 'Tutor ID is required').not().isEmpty()
], assignTutor);

export default router; 