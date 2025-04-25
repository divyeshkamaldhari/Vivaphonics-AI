import express from 'express';
import userRoutes from './userRoutes.js';
import studentRoutes from './studentRoutes.js';
import tutorRoutes from './tutorRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/tutors', tutorRoutes);
router.use('/sessions', sessionRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);

export default router; 