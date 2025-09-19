"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvVars = exports.notFound = exports.asyncHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code
    });
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = {
            ...error,
            message,
            statusCode: 404
        };
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {}).join(', ');
        const message = `Duplicate field value: ${field}. Please use another value.`;
        error = {
            ...error,
            message,
            statusCode: 400
        };
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors || {})
            .map((val) => val.message)
            .join(', ');
        error = {
            ...error,
            message,
            statusCode: 400
        };
    }
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
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
const validateEnvVars = () => {
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
exports.validateEnvVars = validateEnvVars;
//# sourceMappingURL=errorHandler.js.map