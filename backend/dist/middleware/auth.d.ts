import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
export interface AuthRequest extends Request {
    user?: IUser;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuth: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const generateToken: (userId: string) => string;
export declare const verifyToken: (token: string) => {
    id: string;
};
//# sourceMappingURL=auth.d.ts.map