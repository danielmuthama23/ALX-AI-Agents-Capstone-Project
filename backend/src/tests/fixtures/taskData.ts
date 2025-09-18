import mongoose from 'mongoose';
import { ITask } from '../../models/Task';
import { testUsers } from './userData';

/**
 * @interface TestTask
 * @description Interface for test task data
 */
export interface TestTask {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

/**
 * @constant testTasks
 * @description Test task data for unit and integration tests
 */
export const testTasks: TestTask[] = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the TaskFlow API',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    priority: 'high',
    category: 'work',
    completed: false,
    userId: testUsers[0]._id!,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits, and vegetables',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    priority: 'medium',
    category: 'shopping',
    completed: false,
    userId: testUsers[0]._id!,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Schedule dentist appointment',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    priority: 'low',
    category: 'health',
    completed: true,
    userId: testUsers[0]._id!,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Learn React Native',
    description: 'Complete online course on React Native development',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    priority: 'medium',
    category: 'learning',
    completed: false,
    userId: testUsers[1]._id!,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Pay electricity bill',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day overdue
    priority: 'high',
    category: 'finance',
    completed: false,
    userId: testUsers[1]._id!,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * @constant invalidTasks
 * @description Invalid task data for validation tests
 */
export const invalidTasks = [
  {
    title: '', // Empty title
    description: 'This should fail validation',
    priority: 'invalid', // Invalid priority
    category: 'work'
  },
  {
    title: 'A'.repeat(101), // Title too long
    description: 'This title is way too long and should fail validation',
    priority: 'medium',
    category: 'work'
  },
  {
    title: 'Valid title',
    description: 'D'.repeat(1001), // Description too long
    priority: 'medium',
    category: 'work'
  }
];

/**
 * @constant taskCreateData
 * @description Task creation test data
 */
export const taskCreateData = {
  valid: {
    title: 'New test task',
    description: 'This is a test task description',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    category: 'work'
  },
  minimal: {
    title: 'Minimal task',
    priority: 'low'
  },
  withPastDate: {
    title: 'Task with past date',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Past date
    priority: 'high',
    category: 'work'
  }
};

/**
 * @constant taskUpdateData
 * @description Task update test data
 */
export const taskUpdateData = {
  valid: {
    title: 'Updated task title',
    description: 'Updated task description',
    priority: 'high',
    completed: true
  },
  invalid: {
    title: '', // Empty title
    priority: 'invalid' // Invalid priority
  }
};

/**
 * @function createTestTask
 * @description Create a test task object
 */
export const createTestTask = (
  userId: mongoose.Types.ObjectId,
  overrides: Partial<TestTask> = {}
): TestTask => {
  const baseTask: TestTask = {
    _id: new mongoose.Types.ObjectId(),
    title: `Test Task ${Math.random().toString(36).substring(2, 8)}`,
    description: `Description for test task ${Math.random().toString(36).substring(2, 8)}`,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    category: 'work',
    completed: false,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return { ...baseTask, ...overrides };
};

/**
 * @function createCompletedTask
 * @description Create a completed test task
 */
export const createCompletedTask = (
  userId: mongoose.Types.ObjectId,
  overrides: Partial<TestTask> = {}
): TestTask => {
  const baseTask = createTestTask(userId, overrides);
  return {
    ...baseTask,
    completed: true,
    completedAt: new Date()
  };
};

/**
 * @function createOverdueTask
 * @description Create an overdue test task
 */
export const createOverdueTask = (
  userId: mongoose.Types.ObjectId,
  overrides: Partial<TestTask> = {}
): TestTask => {
  const baseTask = createTestTask(userId, overrides);
  return {
    ...baseTask,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days overdue
  };
};

/**
 * @function createDueSoonTask
 * @description Create a task due soon
 */
export const createDueSoonTask = (
  userId: mongoose.Types.ObjectId,
  overrides: Partial<TestTask> = {}
): TestTask => {
  const baseTask = createTestTask(userId, overrides);
  return {
    ...baseTask,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
  };
};