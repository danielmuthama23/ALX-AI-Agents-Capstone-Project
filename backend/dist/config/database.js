"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = exports.getConnectionState = exports.pingDatabase = exports.isDatabaseConnected = exports.getDatabaseStats = exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
const logger_1 = require("../utils/logger");
const getDatabaseConfig = () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
    const options = {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        family: 4,
        serverSelectionTimeoutMS: 5000,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        retryWrites: true,
        w: 'majority'
    };
    if (process.env.NODE_ENV === 'production') {
        options.ssl = true;
        options.sslValidate = true;
    }
    return { uri, options };
};
const connectDB = async () => {
    try {
        const config = getDatabaseConfig();
        mongoose_1.default.connection.on('connecting', () => {
            logger_1.logger.info('Connecting to MongoDB...');
        });
        mongoose_1.default.connection.on('connected', () => {
            logger_1.logger.info('MongoDB connected successfully');
        });
        mongoose_1.default.connection.on('error', (error) => {
            logger_1.logger.error('MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            logger_1.logger.info('MongoDB reconnected');
        });
        process.on('SIGINT', async () => {
            try {
                await mongoose_1.default.connection.close();
                logger_1.logger.info('MongoDB connection closed through app termination');
                process.exit(0);
            }
            catch (error) {
                logger_1.logger.error('Error closing MongoDB connection:', error);
                process.exit(1);
            }
        });
        await mongoose_1.default.connect(config.uri, config.options);
    }
    catch (error) {
        logger_1.logger.error('Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        logger_1.logger.info('Database connection closed');
    }
    catch (error) {
        logger_1.logger.error('Error closing database connection:', error);
        throw error;
    }
};
exports.disconnectDB = disconnectDB;
const getDatabaseStats = async () => {
    try {
        const stats = await mongoose_1.default.connection.db?.admin().serverStatus();
        return {
            connections: stats?.connections?.current || 0,
            readyState: mongoose_1.default.connection.readyState,
            host: mongoose_1.default.connection.host,
            name: mongoose_1.default.connection.name || 'unknown'
        };
    }
    catch (error) {
        logger_1.logger.error('Error getting database stats:', error);
        return {
            connections: 0,
            readyState: mongoose_1.default.connection.readyState,
            host: 'unknown',
            name: 'unknown'
        };
    }
};
exports.getDatabaseStats = getDatabaseStats;
const isDatabaseConnected = () => {
    return mongoose_1.default.connection.readyState === 1;
};
exports.isDatabaseConnected = isDatabaseConnected;
const pingDatabase = async () => {
    try {
        await mongoose_1.default.connection.db?.admin().ping();
        return true;
    }
    catch (error) {
        logger_1.logger.error('Database ping failed:', error);
        return false;
    }
};
exports.pingDatabase = pingDatabase;
const getConnectionState = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    };
    return states[mongoose_1.default.connection.readyState] || 'unknown';
};
exports.getConnectionState = getConnectionState;
exports.default = {
    connectDB: exports.connectDB,
    disconnectDB: exports.disconnectDB,
    getDatabaseStats: exports.getDatabaseStats,
    isDatabaseConnected: exports.isDatabaseConnected,
    pingDatabase: exports.pingDatabase,
    getConnectionState: exports.getConnectionState,
    mongoose: mongoose_1.default
};
//# sourceMappingURL=database.js.map