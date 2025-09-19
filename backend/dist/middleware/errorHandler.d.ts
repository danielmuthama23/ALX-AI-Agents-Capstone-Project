import { Request, Response, NextFunction } from 'express';
interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, any>;
    errors?: Record<string, any>;
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateEnvVars: () => void;
export {};
//# sourceMappingURL=errorHandler.d.ts.map