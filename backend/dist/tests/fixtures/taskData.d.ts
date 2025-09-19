import mongoose from 'mongoose';
export interface TestTask {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    category: string;
    completed: boolean;
    userId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    completedAt?: Date;
}
export declare const testTasks: TestTask[];
export declare const invalidTasks: {
    title: string;
    description: string;
    priority: string;
    category: string;
}[];
export declare const taskCreateData: {
    valid: {
        title: string;
        description: string;
        dueDate: Date;
        priority: string;
        category: string;
    };
    minimal: {
        title: string;
        priority: string;
    };
    withPastDate: {
        title: string;
        dueDate: Date;
        priority: string;
        category: string;
    };
};
export declare const taskUpdateData: {
    valid: {
        title: string;
        description: string;
        priority: string;
        completed: boolean;
    };
    invalid: {
        title: string;
        priority: string;
    };
};
export declare const createTestTask: (userId: mongoose.Types.ObjectId, overrides?: Partial<TestTask>) => TestTask;
export declare const createCompletedTask: (userId: mongoose.Types.ObjectId, overrides?: Partial<TestTask>) => TestTask;
export declare const createOverdueTask: (userId: mongoose.Types.ObjectId, overrides?: Partial<TestTask>) => TestTask;
export declare const createDueSoonTask: (userId: mongoose.Types.ObjectId, overrides?: Partial<TestTask>) => TestTask;
//# sourceMappingURL=taskData.d.ts.map