/**
 * @file Application constants
 * @description Centralized constants for the application
 */

/**
 * @constant TASK_PRIORITIES
 * @description Available task priorities
 */
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export type TaskPriority = typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES];

/**
 * @constant TASK_CATEGORIES
 * @description Common task categories
 */
export const TASK_CATEGORIES = {
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
} as const;

export type TaskCategory = typeof TASK_CATEGORIES[keyof typeof TASK_CATEGORIES];

/**
 * @constant TASK_STATUS
 * @description Task status options
 */
export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  DUE_SOON: 'due-soon'
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

/**
 * @constant HTTP_STATUS_CODES
 * @description HTTP status codes
 */
export const HTTP_STATUS_CODES = {
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
} as const;

/**
 * @constant ERROR_MESSAGES
 * @description Standard error messages
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
  
  // User errors
  USER_NOT_FOUND: 'User not found',
  USER_EXISTS: 'User already exists',
  PASSWORD_MISMATCH: 'Passwords do not match',
  
  // Task errors
  TASK_NOT_FOUND: 'Task not found',
  TASK_VALIDATION_FAILED: 'Task validation failed',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation failed',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 6 characters long',
  
  // Server errors
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
  
  // Rate limiting
  TOO_MANY_REQUESTS: 'Too many requests, please try again later'
} as const;

/**
 * @constant SUCCESS_MESSAGES
 * @description Standard success messages
 */
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  LOGOUT_SUCCESS: 'Logout successful',
  
  // User operations
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  
  // Task operations
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  TASK_COMPLETED: 'Task marked as completed',
  
  // General
  OPERATION_SUCCESS: 'Operation completed successfully'
} as const;

/**
 * @constant VALIDATION_RULES
 * @description Validation rules and limits
 */
export const VALIDATION_RULES = {
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
} as const;

/**
 * @constant PAGINATION_DEFAULTS
 * @description Default pagination values
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
} as const;

/**
 * @constant JWT_CONFIG
 * @description JWT configuration constants
 */
export const JWT_CONFIG = {
  EXPIRES_IN: '7d',
  ISSUER: 'taskflow-api',
  AUDIENCE: 'taskflow-users'
} as const;

/**
 * @constant RATE_LIMIT_CONFIG
 * @description Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100 // Limit each IP to 100 requests per windowMs
} as const;

/**
 * @constant CORS_CONFIG
 * @description CORS configuration
 */
export const CORS_CONFIG = {
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
} as const;

/**
 * @constant ENVIRONMENTS
 * @description Application environments
 */
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
} as const;

/**
 * @constant LOG_LEVELS
 * @description Log levels
 */
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  VERBOSE: 'verbose',
  DEBUG: 'debug',
  SILLY: 'silly'
} as const;

/**
 * @constant AI_CONFIG
 * @description AI service configuration
 */
export const AI_CONFIG = {
  DEFAULT_MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 150,
  TEMPERATURE: 0.3,
  TIMEOUT: 10000 // 10 seconds
} as const;

/**
 * @constant TASK_DUE_DATE_DEFAULTS
 * @description Default due date settings based on priority
 */
export const TASK_DUE_DATE_DEFAULTS = {
  HIGH: 1, // 1 day
  MEDIUM: 3, // 3 days
  LOW: 7 // 7 days
} as const;