import mongoose from 'mongoose';
import User, { IUser } from './User';
import Task, { ITask } from './Task';

/**
 * @file Database models index
 * @description Exports all models and types for easy import
 */

// Export models
export { User, Task };

// Export types
export type { IUser, ITask };

// Export mongoose connection utility functions
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    process.exit(1);
  }
};

// Export mongoose for direct access if needed
export { mongoose };