"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const aiService_1 = require("./aiService");
class TaskService {
    static async createTask(taskData, userId) {
        try {
            let { category, priority } = taskData;
            if (!category || !priority) {
                try {
                    const aiAnalysis = await aiService_1.AIservice.analyzeTask(taskData.title || '', taskData.description || '');
                    category = category || aiAnalysis.category;
                    priority = priority || aiAnalysis.priority;
                }
                catch (aiError) {
                    console.warn('AI analysis failed, using defaults:', aiError);
                    category = category || 'uncategorized';
                    priority = priority || 'medium';
                }
            }
            const task = new Task_1.default({
                ...taskData,
                category,
                priority,
                userId
            });
            return await task.save();
        }
        catch (error) {
            throw new Error(`Task creation failed: ${error.message}`);
        }
    }
    static async getTasks(userId, filters = {}) {
        try {
            const { page = 1, limit = 10, completed, category, priority, search, sortBy = 'dueDate', sortOrder = 'asc' } = filters;
            const query = { userId };
            if (completed !== undefined) {
                query.completed = completed;
            }
            if (category && category !== 'all') {
                query.category = category;
            }
            if (priority && priority !== 'all') {
                query.priority = priority;
            }
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
            const tasks = await Task_1.default.find(query)
                .sort(sortOptions)
                .limit(limit)
                .skip((page - 1) * limit);
            const total = await Task_1.default.countDocuments(query);
            return {
                tasks,
                total,
                totalPages: Math.ceil(total / limit)
            };
        }
        catch (error) {
            throw new Error(`Failed to get tasks: ${error.message}`);
        }
    }
    static async getTaskById(taskId, userId) {
        try {
            const task = await Task_1.default.findOne({ _id: taskId, userId });
            if (!task) {
                throw new Error('Task not found');
            }
            return task;
        }
        catch (error) {
            throw new Error(`Failed to get task: ${error.message}`);
        }
    }
    static async updateTask(taskId, userId, updateData) {
        try {
            const task = await Task_1.default.findOne({ _id: taskId, userId });
            if (!task) {
                throw new Error('Task not found');
            }
            if ((updateData.title && updateData.title !== task.title) ||
                (updateData.description && updateData.description !== task.description)) {
                try {
                    const aiAnalysis = await aiService_1.AIservice.analyzeTask(updateData.title || task.title, updateData.description || task.description);
                    if (!updateData.category)
                        updateData.category = aiAnalysis.category;
                    if (!updateData.priority)
                        updateData.priority = aiAnalysis.priority;
                }
                catch (aiError) {
                    console.warn('AI analysis during update failed:', aiError);
                }
            }
            Object.assign(task, updateData);
            return await task.save();
        }
        catch (error) {
            throw new Error(`Task update failed: ${error.message}`);
        }
    }
    static async deleteTask(taskId, userId) {
        try {
            const result = await Task_1.default.findOneAndDelete({ _id: taskId, userId });
            if (!result) {
                throw new Error('Task not found');
            }
        }
        catch (error) {
            throw new Error(`Task deletion failed: ${error.message}`);
        }
    }
    static async toggleTaskCompletion(taskId, userId) {
        try {
            const task = await Task_1.default.findOne({ _id: taskId, userId });
            if (!task) {
                throw new Error('Task not found');
            }
            task.completed = !task.completed;
            return await task.save();
        }
        catch (error) {
            throw new Error(`Task completion toggle failed: ${error.message}`);
        }
    }
    static async getTaskStatistics(userId) {
        try {
            const stats = await Task_1.default.aggregate([
                { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
                {
                    $facet: {
                        total: [{ $count: "count" }],
                        completed: [{ $match: { completed: true } }, { $count: "count" }],
                        pending: [{ $match: { completed: false } }, { $count: "count" }],
                        byPriority: [
                            { $group: { _id: "$priority", count: { $sum: 1 } } }
                        ],
                        byCategory: [
                            { $group: { _id: "$category", count: { $sum: 1 } } }
                        ],
                        overdue: [
                            {
                                $match: {
                                    completed: false,
                                    dueDate: { $lt: new Date() }
                                }
                            },
                            { $count: "count" }
                        ],
                        dueThisWeek: [
                            {
                                $match: {
                                    completed: false,
                                    dueDate: {
                                        $gte: new Date(),
                                        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                    }
                                }
                            },
                            { $count: "count" }
                        ]
                    }
                }
            ]);
            const result = {
                total: stats[0].total[0]?.count || 0,
                completed: stats[0].completed[0]?.count || 0,
                pending: stats[0].pending[0]?.count || 0,
                byPriority: stats[0].byPriority,
                byCategory: stats[0].byCategory,
                overdue: stats[0].overdue[0]?.count || 0,
                dueThisWeek: stats[0].dueThisWeek[0]?.count || 0
            };
            let insights = '';
            if (result.total > 0) {
                const tasks = await Task_1.default.find({ userId }).limit(10);
                insights = await aiService_1.AIservice.generateInsights(tasks);
            }
            return { ...result, insights };
        }
        catch (error) {
            throw new Error(`Failed to get task statistics: ${error.message}`);
        }
    }
    static async getDueSoonTasks(userId) {
        try {
            const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            return await Task_1.default.find({
                userId,
                completed: false,
                dueDate: {
                    $gte: new Date(),
                    $lte: sevenDaysFromNow
                }
            }).sort({ dueDate: 1, priority: -1 });
        }
        catch (error) {
            throw new Error(`Failed to get due soon tasks: ${error.message}`);
        }
    }
    static async getOverdueTasks(userId) {
        try {
            return await Task_1.default.find({
                userId,
                completed: false,
                dueDate: { $lt: new Date() }
            }).sort({ dueDate: 1, priority: -1 });
        }
        catch (error) {
            throw new Error(`Failed to get overdue tasks: ${error.message}`);
        }
    }
    static async bulkUpdateTasks(userId, taskIds, updateData) {
        try {
            const result = await Task_1.default.updateMany({ _id: { $in: taskIds }, userId }, updateData);
            return { modifiedCount: result.modifiedCount };
        }
        catch (error) {
            throw new Error(`Bulk update failed: ${error.message}`);
        }
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=taskService.js.map