import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

/**
 * @interface LogMetadata
 * @description Additional metadata for logging
 */
interface LogMetadata {
  [key: string]: any;
}

/**
 * @class Logger
 * @description Custom logger class using Winston
 */
class Logger {
  private logger: winston.Logger;

  constructor() {
    const logDir = process.env.LOG_DIR || 'logs';
    
    // Define log formats
    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    );

    const fileFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    // Create logger instance
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      defaultMeta: { service: 'taskflow-api' },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: consoleFormat
        }),
        
        // Daily rotate file transport for errors
        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          format: fileFormat,
          maxFiles: '30d',
          maxSize: '20m'
        }),
        
        // Daily rotate file transport for all logs
        new winston.transports.DailyRotateFile({
          filename: path.join(logDir, 'combined-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          format: fileFormat,
          maxFiles: '30d',
          maxSize: '20m'
        })
      ],
      exceptionHandlers: [
        new winston.transports.File({ 
          filename: path.join(logDir, 'exceptions.log') 
        })
      ],
      rejectionHandlers: [
        new winston.transports.File({ 
          filename: path.join(logDir, 'rejections.log') 
        })
      ]
    });

    // Add stream for Morgan HTTP logging
    this.logger.stream = {
      write: (message: string) => {
        this.info(message.trim());
      }
    } as any;
  }

  /**
   * @method log
   * @description Generic log method
   */
  public log(level: string, message: string, meta?: LogMetadata): void {
    this.logger.log(level, message, meta);
  }

  /**
   * @method error
   * @description Log error messages
   */
  public error(message: string, meta?: LogMetadata): void {
    this.logger.error(message, meta);
  }

  /**
   * @method warn
   * @description Log warning messages
   */
  public warn(message: string, meta?: LogMetadata): void {
    this.logger.warn(message, meta);
  }

  /**
   * @method info
   * @description Log informational messages
   */
  public info(message: string, meta?: LogMetadata): void {
    this.logger.info(message, meta);
  }

  /**
   * @method debug
   * @description Log debug messages
   */
  public debug(message: string, meta?: LogMetadata): void {
    this.logger.debug(message, meta);
  }

  /**
   * @method http
   * @description Log HTTP requests
   */
  public http(message: string, meta?: LogMetadata): void {
    this.logger.http(message, meta);
  }

  /**
   * @method verbose
   * @description Log verbose messages
   */
  public verbose(message: string, meta?: LogMetadata): void {
    this.logger.verbose(message, meta);
  }

  /**
   * @method silly
   * @description Log silly messages
   */
  public silly(message: string, meta?: LogMetadata): void {
    this.logger.silly(message, meta);
  }

  /**
   * @method createChildLogger
   * @description Create a child logger with additional metadata
   */
  public createChildLogger(additionalMeta: LogMetadata): winston.Logger {
    return this.logger.child(additionalMeta);
  }
}

// Create and export singleton instance
export const logger = new Logger();

/**
 * @function requestLogger
 * @description Middleware for logging HTTP requests
 */
export const requestLogger = (req: any, res: any, next: any): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    
    if (res.statusCode >= 400) {
      logger.warn(message, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        duration
      });
    } else {
      logger.info(message, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        duration
      });
    }
  });
  
  next();
};

/**
 * @function logDatabaseQuery
 * @description Log database queries for debugging
 */
export const logDatabaseQuery = (collection: string, operation: string, query: any, duration: number): void => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Database query: ${collection}.${operation}`, {
      collection,
      operation,
      query,
      duration: `${duration}ms`
    });
  }
};

/**
 * @function logError
 * @description Standardized error logging
 */
export const logError = (error: Error, context?: string, meta?: LogMetadata): void => {
  logger.error(error.message, {
    error: error.stack,
    context: context || 'unknown',
    ...meta
  });
};