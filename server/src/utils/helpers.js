import { format, addDays, isBefore, isAfter } from 'date-fns';

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
};

// Format time to HH:mm
export const formatTime = (time) => {
    return format(new Date(`2000-01-01T${time}`), 'HH:mm');
};

// Check if time is between two times
export const isTimeBetween = (time, startTime, endTime) => {
    const checkTime = new Date(`2000-01-01T${time}`);
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return isAfter(checkTime, start) && isBefore(checkTime, end);
};

// Generate random string
export const generateRandomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Calculate session duration in hours
export const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end - start) / (1000 * 60 * 60);
};

// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number format
export const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
};

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}; 