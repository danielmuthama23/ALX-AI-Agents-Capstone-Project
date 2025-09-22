import { config } from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';
import { validateEnvVars } from '../middleware/errorHandler';

/**
 * @file Application configuration
 * @description Centralized configuration management
 */

// Load environment variables
const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`);
config({ path: envPath });

// Fallback to default .env if specific env file doesn't exist
if (process.env.NODE_ENV && !process.env.MONGODB_URI) {
  config({ path: path.resolve(process.cwd(), '.env') });
}

/**
 * @interface AppConfig
 * @description Application configuration interface
 */
export interface AppConfig {
  // Server configuration
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  
  // Database configuration
  MONGODB_URI: string;
  
  // JWT configuration
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  
  // AI configuration
  OPENAI_API_KEY: string;
  
  // Logging configuration
  LOG_LEVEL: string;
  LOG_DIR: string;
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  
  // CORS configuration
  CORS_ORIGIN: string;
  
  // Security
  BCRYPT_SALT_ROUNDS: number;
}

/**
 * @function getConfig
 * @description Get application configuration with defaults
 */
export const getConfig = (): AppConfig => {
  const config: AppConfig = {
    // Server configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    HOST: process.env.HOST || 'localhost',
    
    // Database configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow',
    
    // JWT configuration
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-jwt-secret-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    
    // AI configuration
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    
    // Logging configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_DIR: process.env.LOG_DIR || 'logs',
    
    // Rate limiting
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    
    // CORS configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    
    // Security
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
  };

  return config;
};

/**
 * @function validateConfig
 * @description Validate configuration values
 */
export const validateConfig = (config: AppConfig): void => {
  const errors: string[] = [];

  // Validate required environment variables
  if (!config.MONGODB_URI) {
    errors.push('MONGODB_URI is required');
  }

  if (!config.JWT_SECRET || config.JWT_SECRET === 'fallback-jwt-secret-change-in-production') {
    errors.push('JWT_SECRET is required and must be changed in production');
  }

  if (config.NODE_ENV === 'production' && !config.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY is required in production');
  }

  // Validate numeric values
  if (config.PORT < 1 || config.PORT > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  if (config.BCRYPT_SALT_ROUNDS < 10 || config.BCRYPT_SALT_ROUNDS > 15) {
    errors.push('BCRYPT_SALT_ROUNDS must be between 10 and 15');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }
};

/**
 * @function setupEnvironment
 * @description Setup application environment
 */
export const setupEnvironment = (): void => {
  try {
    const config = getConfig();
    validateConfig(config);
    validateEnvVars();
    
    logger.info('Environment setup completed successfully');
    logger.debug('Configuration loaded:', { 
      NODE_ENV: config.NODE_ENV,
      PORT: config.PORT,
      HOST: config.HOST 
    });
    
  } catch (error) {
    logger.error('Environment setup failed:', { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }
};

/**
 * @function isProduction
 * @description Check if running in production environment
 */
export const isProduction = (): boolean => {
  return getConfig().NODE_ENV === 'production';
};

/**
 * @function isDevelopment
 * @description Check if running in development environment
 */
export const isDevelopment = (): boolean => {
  return getConfig().NODE_ENV === 'development';
};

/**
 * @function isTest
 * @description Check if running in test environment
 */
export const isTest = (): boolean => {
  return getConfig().NODE_ENV === 'test';
};

// Export configuration
export const appConfig = getConfig();

export default {
  getConfig,
  validateConfig,
  setupEnvironment,
  isProduction,
  isDevelopment,
  isTest,
  appConfig
};