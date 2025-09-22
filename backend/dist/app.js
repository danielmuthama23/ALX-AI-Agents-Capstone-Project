"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    },
    crossOriginEmbedderPolicy: false
}));
app.use((0, cors_1.default)({
    origin: config_1.appConfig.CORS_ORIGIN.split(',').map(origin => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.appConfig.RATE_LIMIT_WINDOW_MS,
    max: config_1.appConfig.RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);
app.use((0, compression_1.default)({
    level: 6,
    threshold: 1024
}));
app.use(express_1.default.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '10mb'
}));
if (config_1.appConfig.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write: (message) => {
                console.log(message.trim());
            }
        }
    }));
}
app.use(logger_1.requestLogger);
app.get('/health', (_req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config_1.appConfig.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0'
    };
    res.status(200).json(healthCheck);
});
app.use('/api', routes_1.default);
if (config_1.appConfig.NODE_ENV === 'development') {
    app.get('/api/docs', (_req, res) => {
        res.json({
            message: 'API Documentation',
            endpoints: {
                auth: {
                    'POST /api/auth/register': 'Register new user',
                    'POST /api/auth/login': 'Login user',
                    'GET /api/auth/me': 'Get current user profile',
                    'PUT /api/auth/profile': 'Update user profile',
                    'PUT /api/auth/password': 'Change password',
                    'POST /api/auth/logout': 'Logout user'
                },
                tasks: {
                    'GET /api/tasks': 'Get user tasks with filtering',
                    'GET /api/tasks/:id': 'Get specific task',
                    'POST /api/tasks': 'Create new task',
                    'PUT /api/tasks/:id': 'Update task',
                    'DELETE /api/tasks/:id': 'Delete task',
                    'PATCH /api/tasks/:id/toggle': 'Toggle task completion',
                    'GET /api/tasks/stats/overview': 'Get task statistics',
                    'GET /api/tasks/due-soon': 'Get tasks due soon'
                },
                users: {
                    'GET /api/users/profile': 'Get user profile with stats',
                    'PUT /api/users/profile': 'Update user profile',
                    'DELETE /api/users/account': 'Delete user account',
                    'GET /api/users/activity': 'Get user activity',
                    'GET /api/users/export': 'Export user data'
                }
            }
        });
    });
}
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=app.js.map