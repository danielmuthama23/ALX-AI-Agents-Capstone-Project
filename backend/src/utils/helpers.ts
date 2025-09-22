import { Request } from 'express';
import mongoose from 'mongoose';

/**
 * @interface PaginationResult
 * @description Interface for pagination results
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * @interface ApiResponse
 * @description Standard API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationResult;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * @function successResponse
 * @description Create a standardized success response
 */
export const successResponse = <T>(
  message: string,
  data?: T,
  pagination?: PaginationResult
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    message
  };
  
  if (data !== undefined) {
    response.data = data;
  }
  
  if (pagination !== undefined) {
    response.pagination = pagination;
  }
  
  return response;
};

/**
 * @function errorResponse
 * @description Create a standardized error response
 */
export const errorResponse = (
  message: string,
  errors?: Array<{ field: string; message: string }>
): ApiResponse<null> => {
  const response: ApiResponse<null> = {
    success: false,
    message
  };
  
  if (errors !== undefined) {
    response.errors = errors;
  }
  
  return response;
};

/**
 * @function getPagination
 * @description Calculate pagination parameters
 */
export const getPagination = (
  page: number = 1,
  limit: number = 10,
  total: number = 0
): PaginationResult => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page: Math.max(1, Math.min(page, totalPages)),
    limit: Math.max(1, Math.min(limit, 100)), // Cap limit at 100
    total,
    totalPages
  };
};

/**
 * @function validateObjectId
 * @description Validate MongoDB ObjectId
 */
export const validateObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * @function generateRandomString
 * @description Generate a random string of specified length
 */
export const generateRandomString = (length: number = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * @function sanitizeInput
 * @description Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * @function formatDate
 * @description Format date to readable string
 */
export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * @function calculateDueDate
 * @description Calculate due date based on priority
 */
export const calculateDueDate = (priority: string): Date => {
  const now = new Date();
  
  switch (priority) {
    case 'high':
      return new Date(now.setDate(now.getDate() + 1)); // 1 day
    case 'medium':
      return new Date(now.setDate(now.getDate() + 3)); // 3 days
    case 'low':
      return new Date(now.setDate(now.getDate() + 7)); // 1 week
    default:
      return new Date(now.setDate(now.getDate() + 3)); // Default 3 days
  }
};

/**
 * @function getClientIp
 * @description Get client IP address from request
 */
export const getClientIp = (req: Request): string => {
  return req.ip || 
         (req.connection as any)?.remoteAddress || 
         (req.socket as any)?.remoteAddress ||
         ((req.connection as any)?.socket ? (req.connection as any).socket.remoteAddress : '') ||
         'unknown';
};

/**
 * @function debounce
 * @description Debounce function execution
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * @function throttle
 * @description Throttle function execution
 */
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * @function deepClone
 * @description Create a deep clone of an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      cloned[key as keyof T] = deepClone(obj[key as keyof T]);
    });
    return cloned;
  }
  
  return obj;
};

/**
 * @function isEmail
 * @description Check if string is a valid email
 */
export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @function isStrongPassword
 * @description Check if password meets strength requirements
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * @function generateSlug
 * @description Generate a URL-friendly slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 50);
};

/**
 * @function formatFileSize
 * @description Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * @function getTimeAgo
 * @description Get human-readable time difference
 */
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
};