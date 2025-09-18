import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import { AIservice } from '../services/aiService';

/**
 * @interface AuthRequest
 * @description Extended Request interface for authentication
 */
interface AuthRequest extends Request {
  user?: any;
}

/**
 * @desc Get all tasks for authenticated user with optional filtering and pagination
 * @route GET /api/tasks
 * @access Private
 */
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { 
      page = '1', 
      limit = '10', 
      completed, 
      category, 
      priority,
      search,
      sortBy = 'dueDate',
      sortOrder = 'asc'
    } = req.query;

    // Build query object
    const query: any = { userId };
    
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Get a single task by ID
 * @route GET /api/tasks/:id
 * @access Private
 */
export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Create a new task
 * @route POST /api/tasks
 * @access Private
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { title, description, dueDate } = req.body;
    
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    // Use AI to categorize and prioritize if not provided
    let { category, priority } = req.body;
    
    if (!category || !priority) {
      try {
        const aiAnalysis = await AIservice.analyzeTask(title, description);
        category = category || aiAnalysis.category;
        priority = priority || aiAnalysis.priority;
      } catch (aiError) {
        console.warn('AI analysis failed, using defaults:', aiError);
        category = category || 'uncategorized';
        priority = priority || 'medium';
      }
    }

    const task = new Task({
      title,
      description,
      dueDate,
      category,
      priority,
      userId
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({ 
      message: 'Error creating task', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Update a task
 * @route PUT /api/tasks/:id
 * @access Private
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    const task = await Task.findOne({ _id: taskId, userId });
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // If title or description changed significantly, re-analyze with AI
    if ((req.body.title && req.body.title !== task.title) || 
        (req.body.description && req.body.description !== task.description)) {
      try {
        const aiAnalysis = await AIservice.analyzeTask(
          req.body.title || task.title,
          req.body.description || task.description
        );
        
        // Only update category/priority if they weren't explicitly provided
        if (!req.body.category) req.body.category = aiAnalysis.category;
        if (!req.body.priority) req.body.priority = aiAnalysis.priority;
      } catch (aiError) {
        console.warn('AI analysis during update failed:', aiError);
      }
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({ 
      message: 'Error updating task', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Delete a task
 * @route DELETE /api/tasks/:id
 * @access Private
 */
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Toggle task completion status
 * @route PATCH /api/tasks/:id/toggle
 * @access Private
 */
export const toggleTaskCompletion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    const task = await Task.findOne({ _id: taskId, userId });
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Get task statistics and insights
 * @route GET /api/tasks/stats/overview
 * @access Private
 */
export const getTaskStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    
    const stats = await Task.aggregate([
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

    // Format the response
    const result = {
      total: stats[0].total[0]?.count || 0,
      completed: stats[0].completed[0]?.count || 0,
      pending: stats[0].pending[0]?.count || 0,
      byPriority: stats[0].byPriority,
      byCategory: stats[0].byCategory,
      overdue: stats[0].overdue[0]?.count || 0,
      dueThisWeek: stats[0].dueThisWeek[0]?.count || 0
    };

    // Get AI insights if there are tasks
    let insights = '';
    if (result.total > 0) {
      const tasks = await Task.find({ userId }).limit(10);
      insights = await AIservice.generateInsights(tasks);
    }

    res.json({ ...result, insights });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Get tasks due soon (within next 7 days)
 * @route GET /api/tasks/due-soon
 * @access Private
 */
export const getDueSoonTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      userId,
      completed: false,
      dueDate: { 
        $gte: new Date(),
        $lte: sevenDaysFromNow
      }
    }).sort({ dueDate: 1, priority: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get due soon tasks error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};