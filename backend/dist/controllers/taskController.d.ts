import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getTasks: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleTaskCompletion: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTaskStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getDueSoonTasks: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=taskController.d.ts.map