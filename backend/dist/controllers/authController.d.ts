import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const changePassword: (req: AuthRequest, res: Response) => Promise<void>;
export declare const logout: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=authController.d.ts.map