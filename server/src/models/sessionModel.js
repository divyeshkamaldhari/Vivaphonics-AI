import mongoose from 'mongoose';
import { SESSION_STATUS } from '../config/constants.js';

const sessionSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student is required']
        },
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Tutor is required']
        },
        date: {
            type: Date,
            required: [true, 'Date is required']
        },
        startTime: {
            type: String,
            required: [true, 'Start time is required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:mm)']
        },
        endTime: {
            type: String,
            required: [true, 'End time is required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:mm)']
        },
        status: {
            type: String,
            enum: Object.values(SESSION_STATUS),
            default: SESSION_STATUS.SCHEDULED
        },
        subject: {
            type: String,
            required: [true, 'Subject is required']
        },
        notes: {
            type: String,
            trim: true
        },
        isRecurring: {
            type: Boolean,
            default: false
        },
        recurringPattern: {
            frequency: {
                type: String,
                enum: ['weekly', 'biweekly'],
                required: function() { return this.isRecurring; }
            },
            endDate: {
                type: Date,
                required: function() { return this.isRecurring; }
            },
            daysOfWeek: [{
                type: Number,
                min: 0,
                max: 6,
                required: function() { return this.isRecurring; }
            }]
        },
        cancellationReason: {
            type: String,
            required: function() { return this.status === SESSION_STATUS.CANCELLED; }
        },
        cancelledAt: {
            type: Date
        },
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        completedAt: {
            type: Date
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        feedback: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual field for session duration in hours
sessionSchema.virtual('duration').get(function() {
    const start = new Date(`2000-01-01T${this.startTime}`);
    const end = new Date(`2000-01-01T${this.endTime}`);
    return (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
});

// Middleware to validate end time is after start time
sessionSchema.pre('save', function(next) {
    const start = new Date(`2000-01-01T${this.startTime}`);
    const end = new Date(`2000-01-01T${this.endTime}`);
    
    if (end <= start) {
        next(new Error('End time must be after start time'));
    }
    next();
});

const Session = mongoose.model('Session', sessionSchema);

export default Session; 