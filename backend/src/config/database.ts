import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * @interface DatabaseConfig
 * @description Database configuration interface
 */
interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

/**
 * @function getDatabaseConfig
 * @description Get database configuration based on environment
 */
const getDatabaseConfig = (): DatabaseConfig => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
  
  const options: mongoose.ConnectOptions = {
    // Connection pool options
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    
    // Server selection timeout
    serverSelectionTimeoutMS: 5000,
    
    // Keep alive settings
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    
    // Other options
    retryWrites: true,
    w: 'majority'
  };

  // Add SSL options for production
  if (process.env.NODE_ENV === 'production') {
    options.ssl = true;
    options.sslValidate = true;
  }

  return { uri, options };
};

/**
 * @function connectDB
 * @description Connect to MongoDB database
 */
export const connectDB = async (): Promise<void> => {
  try {
    const config = getDatabaseConfig();
    
    mongoose.connection.on('connecting', () => {
      logger.info('Connecting to MongoDB...');
    });

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Close MongoDB connection when app is terminated
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    // Connect to database
    await mongoose.connect(config.uri, config.options);
    
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

/**
 * @function disconnectDB
 * @description Close database connection
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

/**
 * @function getDatabaseStats
 * @description Get database connection statistics
 */
export const getDatabaseStats = async (): Promise<{
  connections: number;
  readyState: number;
  host: string;
  name: string;
}> => {
  try {
    const stats = await mongoose.connection.db?.admin().serverStatus();
    
    return {
      connections: stats?.connections?.current || 0,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name || 'unknown'
    };
  } catch (error) {
    logger.error('Error getting database stats:', error);
    return {
      connections: 0,
      readyState: mongoose.connection.readyState,
      host: 'unknown',
      name: 'unknown'
    };
  }
};

/**
 * @function isDatabaseConnected
 * @description Check if database is connected
 */
export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

/**
 * @function pingDatabase
 * @description Ping database to check connection health
 */
export const pingDatabase = async (): Promise<boolean> => {
  try {
    await mongoose.connection.db?.admin().ping();
    return true;
  } catch (error) {
    logger.error('Database ping failed:', error);
    return false;
  }
};

/**
 * @function getConnectionState
 * @description Get human-readable connection state
 */
export const getConnectionState = (): string => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  
  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
};

// Export mongoose for direct access if needed
export { mongoose };

export default {
  connectDB,
  disconnectDB,
  getDatabaseStats,
  isDatabaseConnected,
  pingDatabase,
  getConnectionState,
  mongoose
};