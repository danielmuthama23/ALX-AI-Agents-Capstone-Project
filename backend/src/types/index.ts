/**
 * @file Application type definitions
 * @description Centralized TypeScript type definitions for the TaskFlow API
 */

import { Request } from 'express';
import { IUser } from '../models/User';
import { ITask } from '../models/Task';

/**
 * @interface ApiResponse
 * @description Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * @interface PaginatedResponse
 * @description Paginated API response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * @interface AuthRequest
 * @description Extended Request interface with user property
 */
export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * @interface RegisterRequest
 * @description User registration request body
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * @interface LoginRequest
 * @description User login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * @interface CreateTaskRequest
 * @description Task creation request body
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

/**
 * @interface UpdateTaskRequest
 * @description Task update request body
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  completed?: boolean;
}

/**
 * @interface UpdateProfileRequest
 * @description User profile update request body
 */
export interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

/**
 * @interface ChangePasswordRequest
 * @description Password change request body
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * @interface TaskFilters
 * @description Task filtering and pagination options
 */
export interface TaskFilters {
  page?: number;
  limit?: number;
  completed?: boolean;
  category?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * @interface TaskStats
 * @description Task statistics interface
 */
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byPriority: Array<{ _id: string; count: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  overdue: number;
  dueThisWeek: number;
  insights: string;
}

/**
 * @interface UserStats
 * @description User statistics interface
 */
export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
}

/**
 * @interface AIAnalysisResult
 * @description AI task analysis result
 */
export interface AIAnalysisResult {
  category: string;
  priority: 'low' | 'medium' | 'high';
  suggestedDueDate?: string;
}

/**
 * @interface AISuggestions
 * @description AI-generated suggestions
 */
export interface AISuggestions {
  suggestedCategories: string[];
  timeManagementTips: string[];
  commonThemes: string[];
}

/**
 * @interface JwtPayload
 * @description JWT token payload
 */
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

/**
 * @interface DatabaseStats
 * @description Database connection statistics
 */
export interface DatabaseStats {
  connections: number;
  readyState: number;
  host: string;
  name: string;
}

/**
 * @interface LogMetadata
 * @description Logger metadata interface
 */
export interface LogMetadata {
  [key: string]: any;
}

/**
 * @interface ValidationError
 * @description Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * @interface HealthCheckResponse
 * @description Health check response interface
 */
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    connected: boolean;
    state: string;
  };
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
  };
}

/**
 * @interface ExportData
 * @description User data export interface
 */
export interface ExportData {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    priority: string;
    category: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
  }>;
  exportedAt: Date;
  totalTasks: number;
  completedTasks: number;
}

/**
 * @type ApiHandler
 * @description API route handler type
 */
export type ApiHandler = (
  req: AuthRequest,
  res: Response<ApiResponse>
) => Promise<void>;

/**
 * @type AsyncHandler
 * @description Async route handler wrapper type
 */
export type AsyncHandler = (
  fn: ApiHandler
) => (req: AuthRequest, res: Response, next: NextFunction) => void;

// Re-export model interfaces for convenience
export type { IUser, ITask };

// Express types for convenience
import { Response, NextFunction } from 'express';
export { Response, NextFunction };