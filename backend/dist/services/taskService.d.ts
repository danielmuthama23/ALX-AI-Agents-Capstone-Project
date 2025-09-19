import { ITask } from '../models/Task';
export declare class TaskService {
    static createTask(taskData: Partial<ITask>, userId: string): Promise<ITask>;
    static getTasks(userId: string, filters?: {
        page?: number;
        limit?: number;
        completed?: boolean;
        category?: string;
        priority?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        tasks: ITask[];
        total: number;
        totalPages: number;
    }>;
    static getTaskById(taskId: string, userId: string): Promise<ITask>;
    static updateTask(taskId: string, userId: string, updateData: Partial<ITask>): Promise<ITask>;
    static deleteTask(taskId: string, userId: string): Promise<void>;
    static toggleTaskCompletion(taskId: string, userId: string): Promise<ITask>;
    static getTaskStatistics(userId: string): Promise<{
        total: number;
        completed: number;
        pending: number;
        byPriority: {
            _id: string;
            count: number;
        }[];
        byCategory: {
            _id: string;
            count: number;
        }[];
        overdue: number;
        dueThisWeek: number;
        insights: string;
    }>;
    static getDueSoonTasks(userId: string): Promise<ITask[]>;
    static getOverdueTasks(userId: string): Promise<ITask[]>;
    static bulkUpdateTasks(userId: string, taskIds: string[], updateData: Partial<ITask>): Promise<{
        modifiedCount: number;
    }>;
}
//# sourceMappingURL=taskService.d.ts.map