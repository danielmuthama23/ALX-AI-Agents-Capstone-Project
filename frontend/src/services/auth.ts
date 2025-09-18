import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    await api.post('/auth/logout');
  }

  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/auth/me');
    return response.data;
  }

  async updateProfile(updates: Partial<{ username: string; email: string }>): Promise<UserProfile> {
    const response = await api.put<UserProfile>('/auth/profile', updates);
    return response.data;
  }

  async changePassword(passwords: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.put('/auth/password', passwords);
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await api.get<{ available: boolean }>(`/auth/check-email?email=${email}`);
    return response.data.available;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const response = await api.get<{ available: boolean }>(`/auth/check-username?username=${username}`);
    return response.data.available;
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Utility method to get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService();