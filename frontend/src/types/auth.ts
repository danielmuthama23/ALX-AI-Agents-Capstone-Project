export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// Auth error codes
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  EMAIL_ALREADY_EXISTS = 'email_already_exists',
  USERNAME_ALREADY_EXISTS = 'username_already_exists',
  PASSWORD_TOO_WEAK = 'password_too_weak',
  TOKEN_EXPIRED = 'token_expired',
  TOKEN_INVALID = 'token_invalid',
  RATE_LIMITED = 'rate_limited',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error'
}

// Type guards
export const isLoginCredentials = (obj: any): obj is LoginCredentials => {
  return obj &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string' &&
    (obj.rememberMe === undefined || typeof obj.rememberMe === 'boolean');
};

export const isRegisterData = (obj: any): obj is RegisterData => {
  return obj &&
    typeof obj.username === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string' &&
    typeof obj.confirmPassword === 'string';
};

export const isAuthResponse = (obj: any): obj is AuthResponse => {
  return obj &&
    typeof obj.token === 'string' &&
    typeof obj.expiresIn === 'number' &&
    obj.user &&