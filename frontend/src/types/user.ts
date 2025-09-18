export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  stats?: {
    totalTasks: number;
    completedTasks: number;
    highPriorityTasks: number;
  };
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  byCategory: Array<{ _id: string; count: number }>;
  byPriority: Array<{ _id: string; count: number }>;
}

export interface UserActivity {
  date: string;
  tasksCreated: number;
  tasksCompleted: number;
  tasksUpdated: number;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    dueDateReminders: boolean;
    weeklyDigest: boolean;
  };
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

// Default user preferences
export const defaultUserPreferences: UserPreferences = {
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    dueDateReminders: true,
    weeklyDigest: true
  },
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '12h'
};

// Type guards
export const isUser = (obj: any): obj is User => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.username === 'string' &&
    typeof obj.email === 'string' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date;
};

export const isUserProfile = (obj: any): obj is UserProfile => {
  return isUser(obj) && (
    obj.stats === undefined || (
      typeof obj.stats?.totalTasks === 'number' &&
      typeof obj.stats?.completedTasks === 'number' &&
      typeof obj.stats?.highPriorityTasks === 'number'
    )
  );
};