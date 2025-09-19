import { Request } from 'express';
export interface PaginationResult {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: PaginationResult;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}
export declare const successResponse: <T>(message: string, data?: T, pagination?: PaginationResult) => ApiResponse<T>;
export declare const errorResponse: (message: string, errors?: Array<{
    field: string;
    message: string;
}>) => ApiResponse<null>;
export declare const getPagination: (page?: number, limit?: number, total?: number) => PaginationResult;
export declare const validateObjectId: (id: string) => boolean;
export declare const generateRandomString: (length?: number) => string;
export declare const sanitizeInput: (input: string) => string;
export declare const formatDate: (date: Date, format?: string) => string;
export declare const calculateDueDate: (priority: string) => Date;
export declare const getClientIp: (req: Request) => string;
export declare const debounce: <T extends (...args: any[]) => void>(func: T, wait: number) => ((...args: Parameters<T>) => void);
export declare const throttle: <T extends (...args: any[]) => void>(func: T, limit: number) => ((...args: Parameters<T>) => void);
export declare const deepClone: <T>(obj: T) => T;
export declare const isEmail: (email: string) => boolean;
export declare const isStrongPassword: (password: string) => boolean;
export declare const generateSlug: (text: string) => string;
export declare const formatFileSize: (bytes: number) => string;
export declare const getTimeAgo: (date: Date) => string;
//# sourceMappingURL=helpers.d.ts.map