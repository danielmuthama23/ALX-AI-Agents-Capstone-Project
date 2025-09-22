import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { requestLogger } from './utils/logger';
import { appConfig } from './config';
// import { AuthRequest } from './types'; // Unused import

/**
 * @file Express application setup
 * @description Main application configuration and middleware setup
 */

const app = express();

// Security middleware
app.use(helmet({
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

// CORS configuration
app.use(cors({
  origin: appConfig.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: appConfig.RATE_LIMIT_WINDOW_MS,
  max: appConfig.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024
}));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Logging middleware
if (appConfig.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => {
        console.log(message.trim());
      }
    }
  }));
}

// Custom request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: appConfig.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  };
  
  res.status(200).json(healthCheck);
});

// API routes
app.use('/api', routes);

// Serve API documentation in development
if (appConfig.NODE_ENV === 'development') {
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

// 404 handler for undefined routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;