export const ROLES = {
    ADMIN: 'Admin',
    TUTOR: 'Tutor',
    STUDENT: 'Student'
};

export const SESSION_STATUS = {
    SCHEDULED: 'Scheduled',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    PAUSED: 'Paused'
};

export const PAYMENT_STATUS = {
    PENDING: 'Pending',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED: 'Refunded'
};

export const DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 10
};

export const JWT_CONFIG = {
    EXPIRES_IN: process.env.JWT_EXPIRE || '24h',
    SECRET: process.env.JWT_SECRET
};

export const EMAIL_CONFIG = {
    SERVICE: process.env.EMAIL_SERVICE,
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    FROM: process.env.EMAIL_FROM
};

export const CORS_CONFIG = {
    ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    CREDENTIALS: true
};

export const RATE_LIMIT_CONFIG = {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX: 100 // limit each IP to 100 requests per windowMs
}; 