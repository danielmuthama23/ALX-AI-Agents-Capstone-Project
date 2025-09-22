"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = __importDefault(require("../models/User"));
const Task_1 = __importDefault(require("../models/Task"));
class UserService {
    static async getUserProfile(userId) {
        try {
            const user = await User_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const taskStats = await Task_1.default.aggregate([
                { $match: { userId: user._id } },
                {
                    $group: {
                        _id: null,
                        totalTasks: { $sum: 1 },
                        completedTasks: { $sum: { $cond: ['$completed', 1, 0] } },
                        highPriorityTasks: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } }
                    }
                }
            ]);
            const stats = taskStats[0] || {
                totalTasks: 0,
                completedTasks: 0,
                highPriorityTasks: 0
            };
            return { user, stats };
        }
        catch (error) {
            throw new Error(`Failed to get user profile: ${error.message}`);
        }
    }
    static async updateUserProfile(userId, updateData) {
        try {
            if (updateData.email || updateData.username) {
                const existingUser = await User_1.default.findOne({
                    $and: [
                        { _id: { $ne: userId } },
                        {
                            $or: [
                                ...(updateData.email ? [{ email: updateData.email }] : []),
                                ...(updateData.username ? [{ username: updateData.username }] : [])
                            ]
                        }
                    ]
                });
                if (existingUser) {
                    throw new Error('Email or username already taken');
                }
            }
            const updatedUser = await User_1.default.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        }
        catch (error) {
            throw new Error(`Profile update failed: ${error.message}`);
        }
    }
    static async deleteUserAccount(userId, password) {
        try {
            const user = await User_1.default.findById(userId).select('+password');
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            await Task_1.default.deleteMany({ userId });
            await User_1.default.findByIdAndDelete(userId);
        }
        catch (error) {
            throw new Error(`Account deletion failed: ${error.message}`);
        }
    }
    static async getUserActivity(userId, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const activity = await Task_1.default.aggregate([
                {
                    $match: {
                        userId: new (require('mongoose').Types.ObjectId)(userId),
                        $or: [
                            { createdAt: { $gte: startDate } },
                            { completedAt: { $gte: startDate } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        tasksCreated: {
                            $sum: { $cond: [{ $gte: ["$createdAt", startDate] }, 1, 0] }
                        },
                        tasksCompleted: {
                            $sum: { $cond: [{ $and: [{ $ne: ["$completedAt", null] }, { $gte: ["$completedAt", startDate] }] }, 1, 0] }
                        }
                    }
                },
                { $sort: { _id: 1 } }
            ]);
            return activity;
        }
        catch (error) {
            throw new Error(`Failed to get user activity: ${error.message}`);
        }
    }
    static async exportUserData(userId) {
        try {
            const user = await User_1.default.findById(userId);
            const tasks = await Task_1.default.find({ userId });
            if (!user) {
                throw new Error('User not found');
            }
            return {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                tasks: tasks.map(task => {
                    const taskData = {
                        id: task._id,
                        title: task.title,
                        priority: task.priority,
                        category: task.category,
                        completed: task.completed,
                        createdAt: task.createdAt,
                        updatedAt: task.updatedAt
                    };
                    if (task.description)
                        taskData.description = task.description;
                    if (task.dueDate)
                        taskData.dueDate = task.dueDate;
                    if (task.completed)
                        taskData.completedAt = task.updatedAt;
                    return taskData;
                }),
                exportedAt: new Date(),
                totalTasks: tasks.length,
                completedTasks: tasks.filter(task => task.completed).length
            };
        }
        catch (error) {
            throw new Error(`Data export failed: ${error.message}`);
        }
    }
    static async searchUsers(query, page = 1, limit = 10) {
        try {
            const searchQuery = query
                ? {
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                }
                : {};
            const users = await User_1.default.find(searchQuery)
                .select('-password')
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 });
            const total = await User_1.default.countDocuments(searchQuery);
            return {
                users,
                total,
                totalPages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            throw new Error(`User search failed: ${error.message}`);
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map