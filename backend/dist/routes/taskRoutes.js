"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const Task_1 = __importDefault(require("../models/Task"));
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.get('/', taskController_1.getTasks);
router.get('/stats/overview', taskController_1.getTaskStats);
router.get('/due-soon', taskController_1.getDueSoonTasks);
router.get('/overdue', async (req, res) => {
    try {
        const userId = req.user?.id;
        const overdueTasks = await Task_1.default.find({
            userId,
            completed: false,
            dueDate: { $lt: new Date() }
        }).sort({ dueDate: 1 });
        res.json(overdueTasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.patch('/bulk-update', async (req, res) => {
    try {
        const { taskIds, updates } = req.body;
        const userId = req.user?.id;
        const result = await Task_1.default.updateMany({ _id: { $in: taskIds }, userId }, { $set: updates });
        res.json({ modifiedCount: result.modifiedCount });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/export', async (req, res) => {
    try {
        const userId = req.user?.id;
        const tasks = await Task_1.default.find({ userId }).sort({ createdAt: -1 });
        const exportData = {
            user: {
                id: req.user?.id,
                username: req.user?.username,
                email: req.user?.email
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
                updatedAt: task.updatedAt
            })),
            exportedAt: new Date(),
            totalTasks: tasks.length
        };
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="tasks-export.json"');
        res.json(exportData);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:id', taskController_1.getTask);
router.post('/', validation_1.validateTask, taskController_1.createTask);
router.put('/:id', validation_1.validateTask, taskController_1.updateTask);
router.delete('/:id', taskController_1.deleteTask);
router.patch('/:id/toggle', taskController_1.toggleTaskCompletion);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map