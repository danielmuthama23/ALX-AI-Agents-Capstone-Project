import mongoose from 'mongoose';
export declare const connectDB: () => Promise<void>;
export declare const disconnectDB: () => Promise<void>;
export declare const getDatabaseStats: () => Promise<{
    connections: number;
    readyState: number;
    host: string;
    name: string;
}>;
export declare const isDatabaseConnected: () => boolean;
export declare const pingDatabase: () => Promise<boolean>;
export declare const getConnectionState: () => string;
export { mongoose };
declare const _default: {
    connectDB: () => Promise<void>;
    disconnectDB: () => Promise<void>;
    getDatabaseStats: () => Promise<{
        connections: number;
        readyState: number;
        host: string;
        name: string;
    }>;
    isDatabaseConnected: () => boolean;
    pingDatabase: () => Promise<boolean>;
    getConnectionState: () => string;
    mongoose: typeof mongoose;
};
export default _default;
//# sourceMappingURL=database.d.ts.map