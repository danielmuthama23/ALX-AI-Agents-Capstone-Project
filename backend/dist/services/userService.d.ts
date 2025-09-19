import { IUser } from '../models/User';
export declare class UserService {
    static getUserProfile(userId: string): Promise<{
        user: IUser;
        stats: {
            totalTasks: number;
            completedTasks: number;
            highPriorityTasks: number;
        };
    }>;
    static updateUserProfile(userId: string, updateData: Partial<{
        username: string;
        email: string;
    }>): Promise<IUser>;
    static deleteUserAccount(userId: string, password: string): Promise<void>;
    static getUserActivity(userId: string, days?: number): Promise<Array<{
        _id: string;
        tasksCreated: number;
        tasksCompleted: number;
    }>>;
    static exportUserData(userId: string): Promise<{
        user: {
            id: any;
            username: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
        };
        tasks: Array<{
            id: any;
            title: string;
            description?: string;
            dueDate?: Date;
            priority: string;
            category: string;
            completed: boolean;
            createdAt: Date;
            updatedAt: Date;
            completedAt?: Date;
        }>;
        exportedAt: Date;
        totalTasks: number;
        completedTasks: number;
    }>;
    static searchUsers(query: string, page?: number, limit?: number): Promise<{
        users: IUser[];
        total: number;
        totalPages: number;
    }>;
}
//# sourceMappingURL=userService.d.ts.map