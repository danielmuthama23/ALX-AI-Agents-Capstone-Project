export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  DUE_SOON = 'due-soon'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  category: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  completed?: boolean;
  category?: string;
  priority?: TaskPriority;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: TaskStatus;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  category?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  category?: string;
  completed?: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueSoon: number;
  completionRate: number;
  byPriority: Array<{ _id: string; count: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  insights: string;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Type guards
export const isTask = (obj: any): obj is Task => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.completed === 'boolean' &&
    typeof obj.priority === 'string' &&
    typeof obj.userId === 'string' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date;
};

export const isTaskFilters = (obj: any): obj is TaskFilters => {
  return obj && (
    obj.page === undefined || typeof obj.page === 'number'
  ) && (
    obj.limit === undefined || typeof obj.limit === 'number'
  ) && (
    obj.completed === undefined || typeof obj.completed === 'boolean'
  ) && (
    obj.category === undefined || typeof obj.category === 'string'
  ) && (
    obj.priority === undefined || Object.values(TaskPriority).includes(obj.priority)
  ) && (
    obj.search === undefined || typeof obj.search === 'string'
  );
};