import winston from 'winston';
import 'winston-daily-rotate-file';
interface LogMetadata {
    [key: string]: any;
}
declare class Logger {
    private logger;
    constructor();
    log(level: string, message: string, meta?: LogMetadata): void;
    error(message: string, meta?: LogMetadata): void;
    warn(message: string, meta?: LogMetadata): void;
    info(message: string, meta?: LogMetadata): void;
    debug(message: string, meta?: LogMetadata): void;
    http(message: string, meta?: LogMetadata): void;
    verbose(message: string, meta?: LogMetadata): void;
    silly(message: string, meta?: LogMetadata): void;
    createChildLogger(additionalMeta: LogMetadata): winston.Logger;
}
export declare const logger: Logger;
export declare const requestLogger: (req: any, res: any, next: any) => void;
export declare const logDatabaseQuery: (collection: string, operation: string, query: any, duration: number) => void;
export declare const logError: (error: Error, context?: string, meta?: LogMetadata) => void;
export {};
//# sourceMappingURL=logger.d.ts.map