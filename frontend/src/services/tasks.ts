import api from './api';
import { Task, TaskPriority } from '../types/task';

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueSoon: number;
  byPriority: Array<{ _id: string; count: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  insights: string;
}

class TaskService {
  async getTasks(params?: {
    page?: number;
    limit?: number;
    completed?: boolean;
    category?: string;
    priority?: TaskPriority;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<TasksResponse> {
    const response = await api.get<TasksResponse>('/tasks', { params });
    return response.data;
  }

  async getTask(taskId: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${taskId}`);
    return response.data;
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${taskId}`, updates);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  }

  async toggleTaskCompletion(taskId: string, completed: boolean): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${taskId}/toggle`, { completed });
    return response.data;
  }

  async getTaskStats(): Promise<TaskStats> {
    const response = await api.get<TaskStats>('/tasks/stats/overview');
    return response.data;
  }

  async getDueSoonTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks/due-soon');
    return response.data;
  }

  async getOverdueTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks/overdue');
    return response.data;
  }

  async bulkUpdateTasks(taskIds: string[], updates: Partial<Task>): Promise<{ modifiedCount: number }> {
    const response = await api.patch<{ modifiedCount: number }>('/tasks/bulk-update', {
      taskIds,
      updates
    });
    return response.data;
  }

  async exportTasks(): Promise<Blob> {
    const response = await api.get('/tasks/export', {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const taskService = new TaskService();