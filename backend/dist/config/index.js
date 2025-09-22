"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.isTest = exports.isDevelopment = exports.isProduction = exports.setupEnvironment = exports.validateConfig = exports.getConfig = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("../middleware/errorHandler");
const envPath = path_1.default.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`);
(0, dotenv_1.config)({ path: envPath });
if (process.env.NODE_ENV && !process.env.MONGODB_URI) {
    (0, dotenv_1.config)({ path: path_1.default.resolve(process.cwd(), '.env') });
}
const getConfig = () => {
    const config = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: parseInt(process.env.PORT || '5000', 10),
        HOST: process.env.HOST || 'localhost',
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow',
        JWT_SECRET: process.env.JWT_SECRET || 'fallback-jwt-secret-change-in-production',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        LOG_DIR: process.env.LOG_DIR || 'logs',
        RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
        BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
    };
    return config;
};
exports.getConfig = getConfig;
const validateConfig = (config) => {
    const errors = [];
    if (!config.MONGODB_URI) {
        errors.push('MONGODB_URI is required');
    }
    if (!config.JWT_SECRET || config.JWT_SECRET === 'fallback-jwt-secret-change-in-production') {
        errors.push('JWT_SECRET is required and must be changed in production');
    }
    if (config.NODE_ENV === 'production' && !config.OPENAI_API_KEY) {
        errors.push('OPENAI_API_KEY is required in production');
    }
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
exports.validateConfig = validateConfig;
const setupEnvironment = () => {
    try {
        const config = (0, exports.getConfig)();
        (0, exports.validateConfig)(config);
        (0, errorHandler_1.validateEnvVars)();
        logger_1.logger.info('Environment setup completed successfully');
        logger_1.logger.debug('Configuration loaded:', {
            NODE_ENV: config.NODE_ENV,
            PORT: config.PORT,
            HOST: config.HOST
        });
    }
    catch (error) {
        logger_1.logger.error('Environment setup failed:', { error: error instanceof Error ? error.message : String(error) });
        process.exit(1);
    }
};
exports.setupEnvironment = setupEnvironment;
const isProduction = () => {
    return (0, exports.getConfig)().NODE_ENV === 'production';
};
exports.isProduction = isProduction;
const isDevelopment = () => {
    return (0, exports.getConfig)().NODE_ENV === 'development';
};
exports.isDevelopment = isDevelopment;
const isTest = () => {
    return (0, exports.getConfig)().NODE_ENV === 'test';
};
exports.isTest = isTest;
exports.appConfig = (0, exports.getConfig)();
exports.default = {
    getConfig: exports.getConfig,
    validateConfig: exports.validateConfig,
    setupEnvironment: exports.setupEnvironment,
    isProduction: exports.isProduction,
    isDevelopment: exports.isDevelopment,
    isTest: exports.isTest,
    appConfig: exports.appConfig
};
//# sourceMappingURL=index.js.map