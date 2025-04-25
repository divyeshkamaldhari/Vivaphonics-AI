import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { ROLES } from '../config/constants.js';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Get token from cookie
    token = req.cookies.jwt;

    if (!token) {
        // Try getting token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, user not found');
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

// Role-based authorization middleware
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`User role ${req.user.role} is not authorized to access this route`);
        }
        next();
    };
};

// Admin middleware (shorthand for authorize('Admin'))
export const admin = (req, res, next) => {
    if (req.user && req.user.role === ROLES.ADMIN) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
}; 