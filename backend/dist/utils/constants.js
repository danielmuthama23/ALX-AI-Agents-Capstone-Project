"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_DUE_DATE_DEFAULTS = exports.AI_CONFIG = exports.LOG_LEVELS = exports.ENVIRONMENTS = exports.CORS_CONFIG = exports.RATE_LIMIT_CONFIG = exports.JWT_CONFIG = exports.PAGINATION_DEFAULTS = exports.VALIDATION_RULES = exports.SUCCESS_MESSAGES = exports.ERROR_MESSAGES = exports.HTTP_STATUS_CODES = exports.TASK_STATUS = exports.TASK_CATEGORIES = exports.TASK_PRIORITIES = void 0;
exports.TASK_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};
exports.TASK_CATEGORIES = {
    WORK: 'work',
    PERSONAL: 'personal',
    SHOPPING: 'shopping',
    HEALTH: 'health',
    LEARNING: 'learning',
    FINANCE: 'finance',
    HOME: 'home',
    SOCIAL: 'social',
    TRAVEL: 'travel',
    UNCATEGORIZED: 'uncategorized'
};
exports.TASK_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    OVERDUE: 'overdue',
    DUE_SOON: 'due-soon'
};
exports.HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};
exports.ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Token expired',
    TOKEN_INVALID: 'Invalid token',
    USER_NOT_FOUND: 'User not found',
    USER_EXISTS: 'User already exists',
    PASSWORD_MISMATCH: 'Passwords do not match',
    TASK_NOT_FOUND: 'Task not found',
    TASK_VALIDATION_FAILED: 'Task validation failed',
    VALIDATION_ERROR: 'Validation failed',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PASSWORD: 'Password must be at least 6 characters long',
    INTERNAL_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database operation failed',
    TOO_MANY_REQUESTS: 'Too many requests, please try again later'
};
exports.SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    TASK_CREATED: 'Task created successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
    TASK_COMPLETED: 'Task marked as completed',
    OPERATION_SUCCESS: 'Operation completed successfully'
};
exports.VALIDATION_RULES = {
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 30,
        PATTERN: /^[a-zA-Z0-9_]+$/
    },
    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 100
    },
    EMAIL: {
        MAX_LENGTH: 255
    },
    TASK: {
        TITLE: {
            MIN_LENGTH: 1,
            MAX_LENGTH: 100
        },
        DESCRIPTION: {
            MAX_LENGTH: 1000
        },
        CATEGORY: {
            MAX_LENGTH: 50
        }
    }
};
exports.PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100
};
exports.JWT_CONFIG = {
    EXPIRES_IN: '7d',
    ISSUER: 'taskflow-api',
    AUDIENCE: 'taskflow-users'
};
exports.RATE_LIMIT_CONFIG = {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100
};
exports.CORS_CONFIG = {
    ALLOWED_ORIGINS: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://taskflow.ai',
        'https://*.taskflow.ai'
    ],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ]
};
exports.ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
};
exports.LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    HTTP: 'http',
    VERBOSE: 'verbose',
    DEBUG: 'debug',
    SILLY: 'silly'
};
exports.AI_CONFIG = {
    DEFAULT_MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.3,
    TIMEOUT: 10000
};
exports.TASK_DUE_DATE_DEFAULTS = {
    HIGH: 1,
    MEDIUM: 3,
    LOW: 7
};
//# sourceMappingURL=constants.js.map