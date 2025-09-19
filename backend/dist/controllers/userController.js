"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportUserData = exports.getUserActivity = exports.deleteUserAccount = exports.updateUserProfile = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const Task_1 = __importDefault(require("../models/Task"));
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
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
        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            stats
        });
    }
    catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email } = req.body;
        if (!username && !email) {
            res.status(400).json({ message: 'At least one field (username or email) is required' });
            return;
        }
        if (email || username) {
            const existingUser = await User_1.default.findOne({
                $and: [
                    { _id: { $ne: userId } },
                    { $or: [] }
                ]
            });
            const orConditions = [];
            if (email)
                orConditions.push({ email });
            if (username)
                orConditions.push({ username });
            existingUser.$or = orConditions;
            if (existingUser) {
                res.status(409).json({
                    message: 'Email or username already taken'
                });
                return;
            }
        }
        const updateData = {};
        if (username)
            updateData.username = username;
        if (email)
            updateData.email = email;
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });
    }
    catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.updateUserProfile = updateUserProfile;
const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;
        if (!password) {
            res.status(400).json({ message: 'Password is required for account deletion' });
            return;
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
        await Task_1.default.deleteMany({ userId });
        await User_1.default.findByIdAndDelete(userId);
        res.json({ message: 'Account and all associated data deleted successfully' });
    }
    catch (error) {
        console.error('Delete user account error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.deleteUserAccount = deleteUserAccount;
const getUserActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));
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
        res.json(activity);
    }
    catch (error) {
        console.error('Get user activity error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getUserActivity = getUserActivity;
const exportUserData = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId).select('-password');
        const tasks = await Task_1.default.find({ userId });
        const exportData = {
            user: {
                id: user?._id,
                username: user?.username,
                email: user?.email,
                createdAt: user?.createdAt,
                updatedAt: user?.updatedAt
            },
            tasks: tasks.map(task => ({
                id: task._id,
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                category: task.category,
                completed: task.completed,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                completedAt: task.completed ? task.updatedAt : null
            })),
            exportedAt: new Date(),
            totalTasks: tasks.length,
            completedTasks: tasks.filter(task => task.completed).length
        };
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=user-data-export.json');
        res.send(JSON.stringify(exportData, null, 2));
    }
    catch (error) {
        console.error('Export user data error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.exportUserData = exportUserData;
//# sourceMappingURL=userController.js.map