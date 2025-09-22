"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDueSoonTask = exports.createOverdueTask = exports.createCompletedTask = exports.createTestTask = exports.taskUpdateData = exports.taskCreateData = exports.invalidTasks = exports.testTasks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userData_1 = require("./userData");
exports.testTasks = [
    {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the TaskFlow API',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'high',
        category: 'work',
        completed: false,
        userId: userData_1.testUsers[0]?._id || new mongoose_1.default.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, fruits, and vegetables',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        category: 'shopping',
        completed: false,
        userId: userData_1.testUsers[0]?._id || new mongoose_1.default.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: 'Schedule dentist appointment',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'low',
        category: 'health',
        completed: true,
        userId: userData_1.testUsers[0]?._id || new mongoose_1.default.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date()
    },
    {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: 'Learn React Native',
        description: 'Complete online course on React Native development',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        category: 'learning',
        completed: false,
        userId: userData_1.testUsers[1]?._id || new mongoose_1.default.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: 'Pay electricity bill',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: 'high',
        category: 'finance',
        completed: false,
        userId: userData_1.testUsers[1]?._id || new mongoose_1.default.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
exports.invalidTasks = [
    {
        title: '',
        description: 'This should fail validation',
        priority: 'invalid',
        category: 'work'
    },
    {
        title: 'A'.repeat(101),
        description: 'This title is way too long and should fail validation',
        priority: 'medium',
        category: 'work'
    },
    {
        title: 'Valid title',
        description: 'D'.repeat(1001),
        priority: 'medium',
        category: 'work'
    }
];
exports.taskCreateData = {
    valid: {
        title: 'New test task',
        description: 'This is a test task description',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        category: 'work'
    },
    minimal: {
        title: 'Minimal task',
        priority: 'low'
    },
    withPastDate: {
        title: 'Task with past date',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: 'high',
        category: 'work'
    }
};
exports.taskUpdateData = {
    valid: {
        title: 'Updated task title',
        description: 'Updated task description',
        priority: 'high',
        completed: true
    },
    invalid: {
        title: '',
        priority: 'invalid'
    }
};
const createTestTask = (userId, overrides = {}) => {
    const baseTask = {
        _id: new mongoose_1.default.Types.ObjectId(),
        title: `Test Task ${Math.random().toString(36).substring(2, 8)}`,
        description: `Description for test task ${Math.random().toString(36).substring(2, 8)}`,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        category: 'work',
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    return { ...baseTask, ...overrides };
};
exports.createTestTask = createTestTask;
const createCompletedTask = (userId, overrides = {}) => {
    const baseTask = (0, exports.createTestTask)(userId, overrides);
    return {
        ...baseTask,
        completed: true,
        completedAt: new Date()
    };
};
exports.createCompletedTask = createCompletedTask;
const createOverdueTask = (userId, overrides = {}) => {
    const baseTask = (0, exports.createTestTask)(userId, overrides);
    return {
        ...baseTask,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    };
};
exports.createOverdueTask = createOverdueTask;
const createDueSoonTask = (userId, overrides = {}) => {
    const baseTask = (0, exports.createTestTask)(userId, overrides);
    return {
        ...baseTask,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    };
};
exports.createDueSoonTask = createDueSoonTask;
//# sourceMappingURL=taskData.js.map