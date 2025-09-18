import { TaskPriority } from '../types/task';

// Application constants
export const APP_NAME = 'TaskFlow AI';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Intelligent Task Management System';

// API constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 10000;
export const API_MAX_RETRIES = 3;

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'taskflow_token',
  USER: 'taskflow_user',
  THEME: 'taskflow_theme',
  LANGUAGE: 'taskflow_language',
  RECENT_SEARCHES: 'taskflow_recent_searches',
  USER_PREFERENCES: 'taskflow_user_preferences',
} as const;

// Task constants
export const TASK_PRIORITIES = [
  { value: TaskPriority.LOW, label: 'Low', color: 'green' },
  { value: TaskPriority.MEDIUM, label: 'Medium', color: 'yellow' },
  { value: TaskPriority.HIGH, label: 'High', color: 'red' },
] as const;

export const TASK_CATEGORIES = [
  'work',
  'personal',
  'shopping',
  'health',
  'learning',
  'finance',
  'home',
  'social',
  'travel',
  'uncategorized',
] as const;

export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  DUE_SOON: 'due-soon',
} as const;

// Pagination constants
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Date formats
export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  US: 'MM/dd/yyyy',
  EUROPE: 'dd/MM/yyyy',
  FULL: 'MMMM dd, yyyy',
  TIME: 'hh:mm a',
  DATETIME: 'MMM dd, yyyy hh:mm a',
} as const;

// Validation constants
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  EMAIL: {
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
  },
  TASK: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    DESCRIPTION: {
      MAX_LENGTH: 1000,
    },
  },
} as const;

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Language constants
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
} as const;

// Route paths
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  AI_SUGGESTIONS: true,
  DARK_MODE: true,
  OFFLINE_MODE: false,
  EXPORT_DATA: true,
  MULTI_LANGUAGE: false,
} as const;

// Performance constants
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
  CACHE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
} as const;

// Export constants
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf',
} as const;