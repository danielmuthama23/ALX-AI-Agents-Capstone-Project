import { Request } from 'express';
import { IUser } from '../models/User';
import { ITask } from '../models/Task';
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
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface AuthRequest extends Request {
    user?: IUser;
}
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface CreateTaskRequest {
    title: string;
    description?: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
}
export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    completed?: boolean;
}
export interface UpdateProfileRequest {
    username?: string;
    email?: string;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
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
export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    byPriority: Array<{
        _id: string;
        count: number;
    }>;
    byCategory: Array<{
        _id: string;
        count: number;
    }>;
    overdue: number;
    dueThisWeek: number;
    insights: string;
}
export interface UserStats {
    totalTasks: number;
    completedTasks: number;
    highPriorityTasks: number;
}
export interface AIAnalysisResult {
    category: string;
    priority: 'low' | 'medium' | 'high';
    suggestedDueDate?: string;
}
export interface AISuggestions {
    suggestedCategories: string[];
    timeManagementTips: string[];
    commonThemes: string[];
}
export interface JwtPayload {
    id: string;
    iat?: number;
    exp?: number;
}
export interface DatabaseStats {
    connections: number;
    readyState: number;
    host: string;
    name: string;
}
export interface LogMetadata {
    [key: string]: any;
}
export interface ValidationError {
    field: string;
    message: string;
}
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
export type ApiHandler = (req: AuthRequest, res: Response<ApiResponse>) => Promise<void>;
export type AsyncHandler = (fn: ApiHandler) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export type { IUser, ITask };
import { Response, NextFunction } from 'express';
export { Response, NextFunction };
//# sourceMappingURL=index.d.ts.map