"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDueSoonTasks = exports.getTaskStats = exports.toggleTaskCompletion = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const aiService_1 = require("../services/aiService");
const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = '1', limit = '10', completed, category, priority, search, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;
        const query = { userId };
        if (completed !== undefined) {
            query.completed = completed === 'true';
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
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Task_1.default.countDocuments(query);
        res.json({
            tasks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getTasks = getTasks;
const getTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const task = await Task_1.default.findOne({ _id: taskId, userId });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getTask = getTask;
const createTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, dueDate } = req.body;
        if (!title) {
            res.status(400).json({ message: 'Title is required' });
            return;
        }
        let { category, priority } = req.body;
        if (!category || !priority) {
            try {
                const aiAnalysis = await aiService_1.AIservice.analyzeTask(title, description);
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
            title,
            description,
            dueDate,
            category,
            priority,
            userId
        });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    }
    catch (error) {
        console.error('Create task error:', error);
        res.status(400).json({
            message: 'Error creating task',
            error: error.message
        });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const task = await Task_1.default.findOne({ _id: taskId, userId });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        if ((req.body.title && req.body.title !== task.title) ||
            (req.body.description && req.body.description !== task.description)) {
            try {
                const aiAnalysis = await aiService_1.AIservice.analyzeTask(req.body.title || task.title, req.body.description || task.description);
                if (!req.body.category)
                    req.body.category = aiAnalysis.category;
                if (!req.body.priority)
                    req.body.priority = aiAnalysis.priority;
            }
            catch (aiError) {
                console.warn('AI analysis during update failed:', aiError);
            }
        }
        Object.assign(task, req.body);
        const updatedTask = await task.save();
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Update task error:', error);
        res.status(400).json({
            message: 'Error updating task',
            error: error.message
        });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const task = await Task_1.default.findOneAndDelete({ _id: taskId, userId });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.deleteTask = deleteTask;
const toggleTaskCompletion = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const task = await Task_1.default.findOne({ _id: taskId, userId });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        task.completed = !task.completed;
        const updatedTask = await task.save();
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Toggle task error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.toggleTaskCompletion = toggleTaskCompletion;
const getTaskStats = async (req, res) => {
    try {
        const userId = req.user.id;
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
        res.json({ ...result, insights });
    }
    catch (error) {
        console.error('Get task stats error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getTaskStats = getTaskStats;
const getDueSoonTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const tasks = await Task_1.default.find({
            userId,
            completed: false,
            dueDate: {
                $gte: new Date(),
                $lte: sevenDaysFromNow
            }
        }).sort({ dueDate: 1, priority: -1 });
        res.json(tasks);
    }
    catch (error) {
        console.error('Get due soon tasks error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};
exports.getDueSoonTasks = getDueSoonTasks;
//# sourceMappingURL=taskController.js.map