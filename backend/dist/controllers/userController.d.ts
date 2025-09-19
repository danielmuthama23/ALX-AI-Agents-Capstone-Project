import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getUserProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUserProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteUserAccount: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserActivity: (req: AuthRequest, res: Response) => Promise<void>;
export declare const exportUserData: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=userController.d.ts.map