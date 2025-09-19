import mongoose, { Document } from 'mongoose';
export interface ITask extends Document {
    title: string;
    description?: string;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    category: string;
    completed: boolean;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
}
declare const _default: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask> & ITask & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Task.d.ts.map