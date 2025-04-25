import express from 'express';
import {
    getTutors,
    getTutor,
    createTutor,
    updateTutor,
    deleteTutor,
    updateTutorAvailability
} from '../controllers/tutorController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and require admin access
router.use(protect);
router.use(admin);

router.route('/')
    .get(getTutors)
    .post(createTutor);

router.route('/:id')
    .get(getTutor)
    .put(updateTutor)
    .delete(deleteTutor);

router.route('/:id/availability')
    .put(updateTutorAvailability);

export default router; 