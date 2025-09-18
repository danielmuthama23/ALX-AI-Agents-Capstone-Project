import { Task, TaskPriority } from '../types/task';

/**
 * Class names utility for conditionally joining class names
 */
export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = {}): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', mergedOptions).format(dateObj);
};

/**
 * Format date relative to now
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  return formatDate(dateObj);
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Debounce function execution
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Throttle function execution
 */
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      cloned[key as keyof T] = deepClone(obj[key as keyof T]);
    });
    return cloned;
  }

  return obj;
};

/**
 * Merge two objects deeply
 */
export const deepMerge = <T extends object, U extends object>(target: T, source: U): T & U => {
  const output = { ...target } as any;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

/**
 * Check if value is an object
 */
export const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    [TaskPriority.HIGH]: 'red',
    [TaskPriority.MEDIUM]: 'yellow',
    [TaskPriority.LOW]: 'green',
  };

  return colors[priority];
};

/**
 * Get priority text
 */
export const getPriorityText = (priority: TaskPriority): string => {
  const texts = {
    [TaskPriority.HIGH]: 'High',
    [TaskPriority.MEDIUM]: 'Medium',
    [TaskPriority.LOW]: 'Low',
  };

  return texts[priority];
};

/**
 * Check if task is overdue
 */
export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
};

/**
 * Check if task is due soon
 */
export const isTaskDueSoon = (task: Task, days: number = 2): boolean => {
  if (!task.dueDate || task.completed) return false;
  
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const soonDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return dueDate > now && dueDate <= soonDate;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Generate random color
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Sleep function for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Parse JSON safely
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

/**
 * Stringify JSON safely
 */
export const safeJsonStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
};