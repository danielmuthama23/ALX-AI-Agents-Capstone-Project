"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const config_1 = require("./config");
(0, config_1.setupEnvironment)();
const PORT = config_1.appConfig.PORT;
const HOST = config_1.appConfig.HOST;
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
const gracefulShutdown = async (signal) => {
    logger_1.logger.info(`Received ${signal}. Starting graceful shutdown...`);
    try {
        await (0, database_1.disconnectDB)();
        logger_1.logger.info('Database connection closed.');
        if (server) {
            server.close(() => {
                logger_1.logger.info('HTTP server closed.');
                process.exit(0);
            });
        }
        else {
            process.exit(0);
        }
    }
    catch (error) {
        logger_1.logger.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
};
['SIGTERM', 'SIGINT', 'SIGQUIT'].forEach(signal => {
    process.on(signal, () => gracefulShutdown(signal));
});
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        logger_1.logger.info('Database connected successfully.');
        const server = app_1.default.listen(PORT, HOST, () => {
            logger_1.logger.info(`Server running in ${config_1.appConfig.NODE_ENV} mode`);
            logger_1.logger.info(`Server listening on http://${HOST}:${PORT}`);
            logger_1.logger.info(`Health check available at http://${HOST}:${PORT}/health`);
            if (config_1.appConfig.NODE_ENV === 'development') {
                logger_1.logger.info(`API documentation available at http://${HOST}:${PORT}/api/docs`);
            }
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger_1.logger.error(`Port ${PORT} is already in use.`);
                process.exit(1);
            }
            else {
                logger_1.logger.error('Server error:', error);
                process.exit(1);
            }
        });
        return server;
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
let server;
if (require.main === module) {
    server = startServer();
}
exports.default = server;
//# sourceMappingURL=server.js.map