import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth';
import { UserProfile } from '../services/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token && authService.isAuthenticated()) {
        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await authService.login({ email, password });
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      await authService.register({ username, email, password });
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    try {
      const updatedProfile = await authService.updateProfile(updates);
      setUser(updatedProfile);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};