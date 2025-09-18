import api from './api';

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
}

export interface UserActivity {
  _id: string;
  tasksCreated: number;
  tasksCompleted: number;
}

export interface ExportData {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: string;
    category: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
  }>;
  exportedAt: string;
  totalTasks: number;
  completedTasks: number;
}

class UserService {
  async getProfile(): Promise<any> {
    const response = await api.get('/users/profile');
    return response.data;
  }

  async updateProfile(updates: { username?: string; email?: string }): Promise<any> {
    const response = await api.put('/users/profile', updates);
    return response.data;
  }

  async deleteAccount(password: string): Promise<void> {
    await api.delete('/users/account', { data: { password } });
  }

  async getUserActivity(days: number = 30): Promise<UserActivity[]> {
    const response = await api.get<UserActivity[]>(`/users/activity?days=${days}`);
    return response.data;
  }

  async exportUserData(): Promise<ExportData> {
    const response = await api.get<ExportData>('/users/export');
    return response.data;
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{
    users: any[];
    total: number;
    totalPages: number;
  }> {
    const response = await api.get('/users/search', {
      params: { query, page, limit }
    });
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await api.get<UserStats>('/users/stats');
    return response.data;
  }
}

export const userService = new UserService();