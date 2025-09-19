"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logDatabaseQuery = exports.requestLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
class Logger {
    constructor() {
        const logDir = process.env.LOG_DIR || 'logs';
        const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        }));
        const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json());
        this.logger = winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            defaultMeta: { service: 'taskflow-api' },
            transports: [
                new winston_1.default.transports.Console({
                    format: consoleFormat
                }),
                new winston_1.default.transports.DailyRotateFile({
                    filename: path_1.default.join(logDir, 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    format: fileFormat,
                    maxFiles: '30d',
                    maxSize: '20m'
                }),
                new winston_1.default.transports.DailyRotateFile({
                    filename: path_1.default.join(logDir, 'combined-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    format: fileFormat,
                    maxFiles: '30d',
                    maxSize: '20m'
                })
            ],
            exceptionHandlers: [
                new winston_1.default.transports.File({
                    filename: path_1.default.join(logDir, 'exceptions.log')
                })
            ],
            rejectionHandlers: [
                new winston_1.default.transports.File({
                    filename: path_1.default.join(logDir, 'rejections.log')
                })
            ]
        });
        this.logger.stream = {
            write: (message) => {
                this.info(message.trim());
            }
        };
    }
    log(level, message, meta) {
        this.logger.log(level, message, meta);
    }
    error(message, meta) {
        this.logger.error(message, meta);
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    http(message, meta) {
        this.logger.http(message, meta);
    }
    verbose(message, meta) {
        this.logger.verbose(message, meta);
    }
    silly(message, meta) {
        this.logger.silly(message, meta);
    }
    createChildLogger(additionalMeta) {
        return this.logger.child(additionalMeta);
    }
}
exports.logger = new Logger();
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
        if (res.statusCode >= 400) {
            exports.logger.warn(message, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                userId: req.user?.id,
                duration
            });
        }
        else {
            exports.logger.info(message, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                userId: req.user?.id,
                duration
            });
        }
    });
    next();
};
exports.requestLogger = requestLogger;
const logDatabaseQuery = (collection, operation, query, duration) => {
    if (process.env.NODE_ENV === 'development') {
        exports.logger.debug(`Database query: ${collection}.${operation}`, {
            collection,
            operation,
            query,
            duration: `${duration}ms`
        });
    }
};
exports.logDatabaseQuery = logDatabaseQuery;
const logError = (error, context, meta) => {
    exports.logger.error(error.message, {
        error: error.stack,
        context: context || 'unknown',
        ...meta
    });
};
exports.logError = logError;
//# sourceMappingURL=logger.js.map