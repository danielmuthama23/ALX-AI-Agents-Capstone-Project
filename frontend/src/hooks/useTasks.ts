import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilters } from '../types/task';
import { taskService } from '../services/tasks';
import { useAuth } from './useAuth';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    dueSoon: number;
    completionRate: number;
    byPriority: Array<{ _id: string; count: number }>;
    byCategory: Array<{ _id: string; count: number }>;
    insights: string;
  };
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string, completed: boolean) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refetch: () => Promise<void>;
}

export const useTasks = (initialFilters: TaskFilters = {}): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    dueSoon: 0,
    completionRate: 0,
    byPriority: [] as Array<{ _id: string; count: number }>,
    byCategory: [] as Array<{ _id: string; count: number }>,
    insights: ''
  });

  const { user } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await taskService.getTasks({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      setTasks(response.tasks);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user, filters, pagination.page, pagination.limit]);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      const statsData = await taskService.getTaskStats();
      const completionRate = statsData.total > 0 ? (statsData.completed / statsData.total) * 100 : 0;
      setStats({
        ...statsData,
        completionRate
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const createTask = async (taskData: Partial<Task>): Promise<void> => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      
      // Update stats after creating a task
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ));
      
      // Update stats after updating a task
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Update stats after deleting a task
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean): Promise<void> => {
    try {
      const updatedTask = await taskService.updateTask(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ));
      
      // Update stats after toggling completion
      await fetchStats();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const setLimit = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  };

  const refetch = async (): Promise<void> => {
    await fetchTasks();
    await fetchStats();
  };

  return {
    tasks,
    loading,
    error,
    filters,
    pagination,
    stats,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setFilters,
    setPage,
    setLimit,
    refetch
  };
};