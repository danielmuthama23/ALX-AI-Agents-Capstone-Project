import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskStats,
  getDueSoonTasks
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validateTask } from '../middleware/validation';
import Task from '../models/Task';
import { AuthRequest } from '../types';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for authenticated user with filtering and pagination
 * @access  Private
 * @query   page, limit, completed, category, priority, search, sortBy, sortOrder
 */
router.get('/', getTasks);

/**
 * @route   GET /api/tasks/stats/overview
 * @desc    Get task statistics and insights
 * @access  Private
 */
router.get('/stats/overview', getTaskStats);

/**
 * @route   GET /api/tasks/due-soon
 * @desc    Get tasks due soon (within next 7 days)
 * @access  Private
 */
router.get('/due-soon', getDueSoonTasks);

/**
 * @route   GET /api/tasks/overdue
 * @desc    Get overdue tasks
 * @access  Private
 */
router.get('/overdue', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const overdueTasks = await Task.find({
      userId,
      completed: false,
      dueDate: { $lt: new Date() }
    }).sort({ dueDate: 1 });
    
    res.json(overdueTasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PATCH /api/tasks/bulk-update
 * @desc    Bulk update multiple tasks
 * @access  Private
 */
router.patch('/bulk-update', async (req: AuthRequest, res) => {
  try {
    const { taskIds, updates } = req.body;
    const userId = req.user?.id;
    
    const result = await Task.updateMany(
      { _id: { $in: taskIds }, userId },
      { $set: updates }
    );
    
    res.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/tasks/export
 * @desc    Export tasks as JSON
 * @access  Private
 */
router.get('/export', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    
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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get('/:id', getTask);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', validateTask, createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', validateTask, updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', deleteTask);

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Toggle task completion status
 * @access  Private
 */
router.patch('/:id/toggle', toggleTaskCompletion);

export default router;