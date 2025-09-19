export declare const TASK_PRIORITIES: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
};
export type TaskPriority = typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES];
export declare const TASK_CATEGORIES: {
    readonly WORK: "work";
    readonly PERSONAL: "personal";
    readonly SHOPPING: "shopping";
    readonly HEALTH: "health";
    readonly LEARNING: "learning";
    readonly FINANCE: "finance";
    readonly HOME: "home";
    readonly SOCIAL: "social";
    readonly TRAVEL: "travel";
    readonly UNCATEGORIZED: "uncategorized";
};
export type TaskCategory = typeof TASK_CATEGORIES[keyof typeof TASK_CATEGORIES];
export declare const TASK_STATUS: {
    readonly PENDING: "pending";
    readonly COMPLETED: "completed";
    readonly OVERDUE: "overdue";
    readonly DUE_SOON: "due-soon";
};
export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export declare const HTTP_STATUS_CODES: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly ACCEPTED: 202;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const ERROR_MESSAGES: {
    readonly INVALID_CREDENTIALS: "Invalid email or password";
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly TOKEN_EXPIRED: "Token expired";
    readonly TOKEN_INVALID: "Invalid token";
    readonly USER_NOT_FOUND: "User not found";
    readonly USER_EXISTS: "User already exists";
    readonly PASSWORD_MISMATCH: "Passwords do not match";
    readonly TASK_NOT_FOUND: "Task not found";
    readonly TASK_VALIDATION_FAILED: "Task validation failed";
    readonly VALIDATION_ERROR: "Validation failed";
    readonly INVALID_EMAIL: "Invalid email format";
    readonly INVALID_PASSWORD: "Password must be at least 6 characters long";
    readonly INTERNAL_ERROR: "Internal server error";
    readonly DATABASE_ERROR: "Database operation failed";
    readonly TOO_MANY_REQUESTS: "Too many requests, please try again later";
};
export declare const SUCCESS_MESSAGES: {
    readonly LOGIN_SUCCESS: "Login successful";
    readonly REGISTER_SUCCESS: "Registration successful";
    readonly LOGOUT_SUCCESS: "Logout successful";
    readonly PROFILE_UPDATED: "Profile updated successfully";
    readonly PASSWORD_CHANGED: "Password changed successfully";
    readonly TASK_CREATED: "Task created successfully";
    readonly TASK_UPDATED: "Task updated successfully";
    readonly TASK_DELETED: "Task deleted successfully";
    readonly TASK_COMPLETED: "Task marked as completed";
    readonly OPERATION_SUCCESS: "Operation completed successfully";
};
export declare const VALIDATION_RULES: {
    readonly USERNAME: {
        readonly MIN_LENGTH: 3;
        readonly MAX_LENGTH: 30;
        readonly PATTERN: RegExp;
    };
    readonly PASSWORD: {
        readonly MIN_LENGTH: 6;
        readonly MAX_LENGTH: 100;
    };
    readonly EMAIL: {
        readonly MAX_LENGTH: 255;
    };
    readonly TASK: {
        readonly TITLE: {
            readonly MIN_LENGTH: 1;
            readonly MAX_LENGTH: 100;
        };
        readonly DESCRIPTION: {
            readonly MAX_LENGTH: 1000;
        };
        readonly CATEGORY: {
            readonly MAX_LENGTH: 50;
        };
    };
};
export declare const PAGINATION_DEFAULTS: {
    readonly PAGE: 1;
    readonly LIMIT: 10;
    readonly MAX_LIMIT: 100;
};
export declare const JWT_CONFIG: {
    readonly EXPIRES_IN: "7d";
    readonly ISSUER: "taskflow-api";
    readonly AUDIENCE: "taskflow-users";
};
export declare const RATE_LIMIT_CONFIG: {
    readonly WINDOW_MS: number;
    readonly MAX_REQUESTS: 100;
};
export declare const CORS_CONFIG: {
    readonly ALLOWED_ORIGINS: readonly ["http://localhost:3000", "http://localhost:3001", "https://taskflow.ai", "https://*.taskflow.ai"];
    readonly ALLOWED_METHODS: readonly ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
    readonly ALLOWED_HEADERS: readonly ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"];
};
export declare const ENVIRONMENTS: {
    readonly DEVELOPMENT: "development";
    readonly PRODUCTION: "production";
    readonly TEST: "test";
};
export declare const LOG_LEVELS: {
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly HTTP: "http";
    readonly VERBOSE: "verbose";
    readonly DEBUG: "debug";
    readonly SILLY: "silly";
};
export declare const AI_CONFIG: {
    readonly DEFAULT_MODEL: "gpt-3.5-turbo";
    readonly MAX_TOKENS: 150;
    readonly TEMPERATURE: 0.3;
    readonly TIMEOUT: 10000;
};
export declare const TASK_DUE_DATE_DEFAULTS: {
    readonly HIGH: 1;
    readonly MEDIUM: 3;
    readonly LOW: 7;
};
//# sourceMappingURL=constants.d.ts.map