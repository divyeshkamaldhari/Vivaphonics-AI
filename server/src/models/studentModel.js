import mongoose from 'mongoose';
import { isValidEmail, isValidPhone } from '../utils/helpers.js';

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: isValidEmail,
                message: 'Please enter a valid email'
            }
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
            validate: {
                validator: isValidPhone,
                message: 'Please enter a valid phone number'
            }
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Paused'],
            default: 'Active'
        },
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: {
            type: String,
            trim: true
        },
        subjects: [{
            type: String,
            trim: true
        }],
        preferredSchedule: [{
            dayOfWeek: {
                type: Number,
                required: true,
                min: 0,
                max: 6
            },
            startTime: {
                type: String,
                required: true,
                match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:mm)']
            },
            endTime: {
                type: String,
                required: true,
                match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:mm)']
            }
        }],
        emergencyContact: {
            name: {
                type: String,
                trim: true
            },
            relationship: {
                type: String,
                trim: true
            },
            phone: {
                type: String,
                validate: {
                    validator: isValidPhone,
                    message: 'Please enter a valid phone number'
                }
            }
        },
        dateOfBirth: {
            type: Date
        },
        grade: {
            type: String,
            trim: true
        },
        school: {
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

// Virtual for student's age
studentSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Virtual for sessions
studentSchema.virtual('sessions', {
    ref: 'Session',
    localField: '_id',
    foreignField: 'student'
});

// Middleware to validate preferred schedule times
studentSchema.pre('save', function(next) {
    if (this.preferredSchedule) {
        for (const schedule of this.preferredSchedule) {
            const start = new Date(`2000-01-01T${schedule.startTime}`);
            const end = new Date(`2000-01-01T${schedule.endTime}`);
            
            if (end <= start) {
                next(new Error('End time must be after start time in preferred schedule'));
            }
        }
    }
    next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student; 