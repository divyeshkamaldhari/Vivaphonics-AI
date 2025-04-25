const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number,
        required: true,
        min: 0, // Sunday
        max: 6  // Saturday
    },
    startTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    },
    endTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    }
});

const tutorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    qualifications: {
        type: String,
        required: [true, 'Qualifications are required'],
        trim: true
    },
    hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required'],
        min: [0, 'Hourly rate must be a positive number']
    },
    totalSessions: {
        type: Number,
        default: 0
    },
    availability: [availabilitySlotSchema],
    archived: {
        type: Boolean,
        default: false
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
tutorSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Validate that endTime is after startTime
availabilitySlotSchema.pre('save', function(next) {
    const start = parseInt(this.startTime.replace(':', ''));
    const end = parseInt(this.endTime.replace(':', ''));
    
    if (end <= start) {
        next(new Error('End time must be after start time'));
    }
    next();
});

module.exports = mongoose.model('Tutor', tutorSchema); 