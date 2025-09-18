import Task, { ITask } from '../models/Task';
import { AIservice } from './aiService';

/**
 * @class TaskService
 * @description Service layer for task operations
 */
export class TaskService {
  /**
   * @method createTask
   * @description Create a new task with optional AI analysis
   */
  static async createTask(
    taskData: Partial<ITask>,
    userId: string
  ): Promise<ITask> {
    try {
      let { category, priority } = taskData;

      // Use AI to categorize and prioritize if not provided
      if (!category || !priority) {
        try {
          const aiAnalysis = await AIservice.analyzeTask(
            taskData.title || '',
            taskData.description || ''
          );
          category = category || aiAnalysis.category;
          priority = priority || aiAnalysis.priority;
        } catch (aiError) {
          console.warn('AI analysis failed, using defaults:', aiError);
          category = category || 'uncategorized';
          priority = priority || 'medium';
        }
      }

      const task = new Task({
        ...taskData,
        category,
        priority,
        userId
      });

      return await task.save();
    } catch (error) {
      throw new Error(`Task creation failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method getTasks
   * @description Get tasks with filtering and pagination
   */
  static async getTasks(
    userId: string,
    filters: {
      page?: number;
      limit?: number;
      completed?: boolean;
      category?: string;
      priority?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ tasks: ITask[]; total: number; totalPages: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        completed,
        category,
        priority,
        search,
        sortBy = 'dueDate',
        sortOrder = 'asc'
      } = filters;

      // Build query object
      const query: any = { userId };
      
      if (completed !== undefined) {
        query.completed = completed;
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
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const tasks = await Task.find(query)
        .sort(sortOptions)
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await Task.countDocuments(query);

      return {
        tasks,
        total,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get tasks: ${(error as Error).message}`);
    }
  }

  /**
   * @method getTaskById
   * @description Get a single task by ID
   */
  static async getTaskById(taskId: string, userId: string): Promise<ITask> {
    try {
      const task = await Task.findOne({ _id: taskId, userId });
      
      if (!task) {
        throw new Error('Task not found');
      }

      return task;
    } catch (error) {
      throw new Error(`Failed to get task: ${(error as Error).message}`);
    }
  }

  /**
   * @method updateTask
   * @description Update a task
   */
  static async updateTask(
    taskId: string,
    userId: string,
    updateData: Partial<ITask>
  ): Promise<ITask> {
    try {
      const task = await Task.findOne({ _id: taskId, userId });
      
      if (!task) {
        throw new Error('Task not found');
      }

      // If title or description changed significantly, re-analyze with AI
      if ((updateData.title && updateData.title !== task.title) || 
          (updateData.description && updateData.description !== task.description)) {
        try {
          const aiAnalysis = await AIservice.analyzeTask(
            updateData.title || task.title,
            updateData.description || task.description
          );
          
          // Only update category/priority if they weren't explicitly provided
          if (!updateData.category) updateData.category = aiAnalysis.category;
          if (!updateData.priority) updateData.priority = aiAnalysis.priority;
        } catch (aiError) {
          console.warn('AI analysis during update failed:', aiError);
        }
      }

      Object.assign(task, updateData);
      return await task.save();
    } catch (error) {
      throw new Error(`Task update failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method deleteTask
   * @description Delete a task
   */
  static async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      const result = await Task.findOneAndDelete({ _id: taskId, userId });
      
      if (!result) {
        throw new Error('Task not found');
      }
    } catch (error) {
      throw new Error(`Task deletion failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method toggleTaskCompletion
   * @description Toggle task completion status
   */
  static async toggleTaskCompletion(taskId: string, userId: string): Promise<ITask> {
    try {
      const task = await Task.findOne({ _id: taskId, userId });
      
      if (!task) {
        throw new Error('Task not found');
      }

      task.completed = !task.completed;
      return await task.save();
    } catch (error) {
      throw new Error(`Task completion toggle failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method getTaskStatistics
   * @description Get task statistics and insights
   */
  static async getTaskStatistics(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    byPriority: { _id: string; count: number }[];
    byCategory: { _id: string; count: number }[];
    overdue: number;
    dueThisWeek: number;
    insights: string;
  }> {
    try {
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

      return { ...result, insights };
    } catch (error) {
      throw new Error(`Failed to get task statistics: ${(error as Error).message}`);
    }
  }

  /**
   * @method getDueSoonTasks
   * @description Get tasks due soon (within next 7 days)
   */
  static async getDueSoonTasks(userId: string): Promise<ITask[]> {
    try {
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      return await Task.find({
        userId,
        completed: false,
        dueDate: { 
          $gte: new Date(),
          $lte: sevenDaysFromNow
        }
      }).sort({ dueDate: 1, priority: -1 });
    } catch (error) {
      throw new Error(`Failed to get due soon tasks: ${(error as Error).message}`);
    }
  }

  /**
   * @method getOverdueTasks
   * @description Get overdue tasks
   */
  static async getOverdueTasks(userId: string): Promise<ITask[]> {
    try {
      return await Task.find({
        userId,
        completed: false,
        dueDate: { $lt: new Date() }
      }).sort({ dueDate: 1, priority: -1 });
    } catch (error) {
      throw new Error(`Failed to get overdue tasks: ${(error as Error).message}`);
    }
  }

  /**
   * @method bulkUpdateTasks
   * @description Update multiple tasks at once
   */
  static async bulkUpdateTasks(
    userId: string,
    taskIds: string[],
    updateData: Partial<ITask>
  ): Promise<{ modifiedCount: number }> {
    try {
      const result = await Task.updateMany(
        { _id: { $in: taskIds }, userId },
        updateData
      );

      return { modifiedCount: result.modifiedCount };
    } catch (error) {
      throw new Error(`Bulk update failed: ${(error as Error).message}`);
    }
  }
}