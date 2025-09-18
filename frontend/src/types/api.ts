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

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// API Error Codes
export enum ApiErrorCode {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  VALIDATION_ERROR = 'validation_error',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMITED = 'rate_limited',
  SERVER_ERROR = 'server_error',
  UNKNOWN_ERROR = 'unknown_error',
}

// Type guards
export const isApiResponse = (obj: any): obj is ApiResponse => {
  return obj && typeof obj.success === 'boolean' && typeof obj.message === 'string';
};

export const isErrorResponse = (obj: any): obj is ErrorResponse => {
  return obj && typeof obj.code === 'string' && typeof obj.message === 'string';
};

export const isValidationError = (obj: any): obj is ValidationError => {
  return obj && typeof obj.field === 'string' && typeof obj.message === 'string';
};