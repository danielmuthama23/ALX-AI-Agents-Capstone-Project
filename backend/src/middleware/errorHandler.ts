import { Request, Response, NextFunction } from 'express';
// import mongoose from 'mongoose'; // Unused import

/**
 * @interface CustomError
 * @description Custom error interface for application errors
 */
interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
}

/**
 * @function errorHandler
 * @description Global error handling middleware
 */
export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      ...error,
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error = {
      ...error,
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((val: any) => val.message)
      .join(', ');
    error = {
      ...error,
      message,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      ...error,
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      ...error,
      message,
      statusCode: 401
    };
  }

  // Default to 500 server error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

/**
 * @function asyncHandler
 * @description Wrapper for async functions to handle errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * @function notFound
 * @description 404 handler middleware
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * @function validateEnvVars
 * @description Validate required environment variables
 */
export const validateEnvVars = (): void => {
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'OPENAI_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};