const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
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
        required: [true, 'Session date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Duration is required']
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Canceled', 'Paused'],
        default: 'Scheduled'
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
            max: 6
        }]
    },
    notes: {
        type: String,
        trim: true
    },
    canceledAt: {
        type: Date
    },
    canceledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    canceledReason: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
sessionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Validate that endTime is after startTime
sessionSchema.pre('save', function(next) {
    const start = parseInt(this.startTime.replace(':', ''));
    const end = parseInt(this.endTime.replace(':', ''));
    
    if (end <= start) {
        next(new Error('End time must be after start time'));
    }
    next();
});

// Calculate duration in minutes
sessionSchema.pre('save', function(next) {
    const start = new Date(`2000-01-01T${this.startTime}`);
    const end = new Date(`2000-01-01T${this.endTime}`);
    this.duration = (end - start) / (1000 * 60);
    next();
});

module.exports = mongoose.model('Session', sessionSchema); 