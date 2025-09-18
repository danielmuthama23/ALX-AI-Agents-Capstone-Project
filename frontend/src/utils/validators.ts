import { VALIDATION_RULES } from './constants';

/**
 * Validate email address
 */
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }

  if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
    return `Email must be less than ${VALIDATION_RULES.EMAIL.MAX_LENGTH} characters`;
  }

  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

/**
 * Validate username
 */
export const validateUsername = (username: string): string | null => {
  if (!username) {
    return 'Username is required';
  }

  if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    return `Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters`;
  }

  if (username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    return `Username must be less than ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`;
  }

  if (!VALIDATION_RULES.USERNAME.PATTERN.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }

  return null;
};

/**
 * Validate password
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`;
  }

  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return `Password must be less than ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`;
  }

  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }

  return null;
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

/**
 * Validate task title
 */
export const validateTaskTitle = (title: string): string | null => {
  if (!title) {
    return 'Task title is required';
  }

  if (title.length < VALIDATION_RULES.TASK.TITLE.MIN_LENGTH) {
    return `Task title must be at least ${VALIDATION_RULES.TASK.TITLE.MIN_LENGTH} character`;
  }

  if (title.length > VALIDATION_RULES.TASK.TITLE.MAX_LENGTH) {
    return `Task title must be less than ${VALIDATION_RULES.TASK.TITLE.MAX_LENGTH} characters`;
  }

  return null;
};

/**
 * Validate task description
 */
export const validateTaskDescription = (description: string): string | null => {
  if (description && description.length > VALIDATION_RULES.TASK.DESCRIPTION.MAX_LENGTH) {
    return `Description must be less than ${VALIDATION_RULES.TASK.DESCRIPTION.MAX_LENGTH} characters`;
  }

  return null;
};

/**
 * Validate due date
 */
export const validateDueDate = (dueDate: Date | null): string | null => {
  if (dueDate && dueDate < new Date()) {
    return 'Due date must be in the future';
  }

  return null;
};

/**
 * Validate category
 */
export const validateCategory = (category: string): string | null => {
  if (category && category.length > 50) {
    return 'Category must be less than 50 characters';
  }

  return null;
};

/**
 * Validate form fields
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  validators: { [K in keyof T]?: (value: T[K]) => string | null }
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};

  Object.keys(validators).forEach(key => {
    const validator = validators[key as keyof T];
    const value = values[key as keyof T];
    
    if (validator) {
      const error = validator(value);
      if (error) {
        errors[key as keyof T] = error;
      }
    }
  });

  return errors;
};

/**
 * Check if form is valid
 */
export const isFormValid = (errors: Record<string, string | null>): boolean => {
  return Object.values(errors).every(error => error === null);
};

/**
 * Sanitize input text
 */
export const sanitizeInput = (text: string): string => {
  return text
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): string | null => {
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

/**
 * Validate number range
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number
): string | null => {
  if (value < min) {
    return `Value must be at least ${min}`;
  }

  if (value > max) {
    return `Value must be at most ${max}`;
  }

  return null;
};

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value) {
    return `${fieldName} is required`;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`;
  }

  return null;
};

/**
 * Validate array minimum length
 */
export const validateArrayMinLength = (
  array: any[],
  minLength: number,
  fieldName: string
): string | null => {
  if (array.length < minLength) {
    return `${fieldName} must have at least ${minLength} items`;
  }

  return null;
};

/**
 * Validate file type
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }

  return null;
};

/**
 * Validate file size
 */
export const validateFileSize = (
  file: File,
  maxSize: number // in bytes
): string | null => {
  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / 1024 / 1024}MB`;
  }

  return null;
};