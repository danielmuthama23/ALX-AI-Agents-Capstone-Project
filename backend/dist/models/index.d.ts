import mongoose from 'mongoose';
import User, { IUser } from './User';
import Task, { ITask } from './Task';
export { User, Task };
export type { IUser, ITask };
export declare const connectDB: () => Promise<void>;
export declare const disconnectDB: () => Promise<void>;
export { mongoose };
//# sourceMappingURL=index.d.ts.map