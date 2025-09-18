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