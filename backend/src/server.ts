import app from './app';
import { connectDB, disconnectDB } from './config/database';
import { logger } from './utils/logger';
import { appConfig, setupEnvironment } from './config';

/**
 * @file Server entry point
 * @description Main server startup and shutdown handling
 */

// Setup environment and validate configuration
setupEnvironment();

const PORT = appConfig.PORT;
const HOST = appConfig.HOST;

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown function
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close database connection
    await disconnectDB();
    logger.info('Database connection closed.');
    
    // Close server
    if (server) {
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Listen for shutdown signals
['SIGTERM', 'SIGINT', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => gracefulShutdown(signal));
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    logger.info('Database connected successfully.');

    // Start HTTP server
    const server = app.listen(PORT, HOST, () => {
      logger.info(`Server running in ${appConfig.NODE_ENV} mode`);
      logger.info(`Server listening on http://${HOST}:${PORT}`);
      logger.info(`Health check available at http://${HOST}:${PORT}/health`);
      
      if (appConfig.NODE_ENV === 'development') {
        logger.info(`API documentation available at http://${HOST}:${PORT}/api/docs`);
      }
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use.`);
        process.exit(1);
      } else {
        logger.error('Server error:', error);
        process.exit(1);
      }
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Export server for testing
let server: any;
if (require.main === module) {
  server = startServer();
}

export default server;