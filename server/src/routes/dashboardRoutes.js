import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardData } from '../controllers/dashboardController.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getDashboardData);

export default router; 