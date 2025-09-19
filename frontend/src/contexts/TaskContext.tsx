import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Task, TaskFilters } from '../types/task';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/tasks';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string, completed: boolean) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearError: () => void;
  refetchTasks: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { isAuthenticated } = useAuth();

  const fetchTasks = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks(filters);
      setTasks(response.tasks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [isAuthenticated, filters]);

  const createTask = async (taskData: Partial<Task>): Promise<void> => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
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
      
      if (selectedTask?.id === taskId) {
        setSelectedTask(updatedTask);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
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
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const clearError = () => setError(null);

  const refetchTasks = async () => {
    await fetchTasks();
  };

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    filters,
    selectedTask,
    setSelectedTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setFilters,
    clearError,
    refetchTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};