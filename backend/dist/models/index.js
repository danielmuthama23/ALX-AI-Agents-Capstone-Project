"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = exports.disconnectDB = exports.connectDB = exports.Task = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Task_1 = __importDefault(require("./Task"));
exports.Task = Task_1.default;
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('Database connection closed');
    }
    catch (error) {
        console.error('Error closing database connection:', error);
        process.exit(1);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=index.js.map