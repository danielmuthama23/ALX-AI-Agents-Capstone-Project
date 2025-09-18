import mongoose from 'mongoose';
import { TaskService } from '../../services/taskService';
import { AIservice } from '../../services/aiService';
import { testTasks, testUsers } from '../fixtures/userData';
import { Task } from '../../models/Task';

// Mock the Task model and AI service
jest.mock('../../models/Task');
jest.mock('../../services/aiService');

describe('TaskService - Unit Tests', () => {
  const userId = testUsers[0]._id!.toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium' as const,
        category: 'work'
      };

      const mockTask = {
        ...taskData,
        userId,
        save: jest.fn().mockResolvedValue({
          ...taskData,
          _id: new mongoose.Types.ObjectId(),
          userId,
          completed: false
        })
      };

      (Task as unknown as jest.Mock).mockImplementation(() => mockTask);
      (AIservice.analyzeTask as jest.Mock).mockResolvedValue({
        category: 'work',
        priority: 'medium'
      });

      const result = await TaskService.createTask(taskData, userId);

      expect(result).toHaveProperty('title', taskData.title);
      expect(result).toHaveProperty('userId', userId);
      expect(Task).toHaveBeenCalled();
      expect(mockTask.save).toHaveBeenCalled();
    });

    it('should use AI analysis when category/priority not provided', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      const aiAnalysis = {
        category: 'work',
        priority: 'high'
      };

      (AIservice.analyzeTask as jest.Mock).mockResolvedValue(aiAnalysis);

      const mockTask = {
        ...taskData,
        ...aiAnalysis,
        userId,
        save: jest.fn().mockResolvedValue({
          ...taskData,
          ...aiAnalysis,
          _id: new mongoose.Types.ObjectId(),
          userId,
          completed: false
        })
      };

      (Task as unknown as jest.Mock).mockImplementation(() => mockTask);

      const result = await TaskService.createTask(taskData, userId);

      expect(result.category).toBe(aiAnalysis.category);
      expect(result.priority).toBe(aiAnalysis.priority);
      expect(AIservice.analyzeTask).toHaveBeenCalledWith(taskData.title, taskData.description);
    });
  });

  describe('getTasks', () => {
    it('should return tasks with pagination', async () => {
      const mockTasks = testTasks.filter(task => task.userId.toString() === userId);
      const total = mockTasks.length;

      (Task.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue(mockTasks)
          })
        })
      });

      (Task.countDocuments as jest.Mock).mockResolvedValue(total);

      const result = await TaskService.getTasks(userId, {
        page: 1,
        limit: 10
      });

      expect(result.tasks).toEqual(mockTasks);
      expect(result.total).toBe(total);
      expect(result.totalPages).toBe(Math.ceil(total / 10));
    });

    it('should apply filters correctly', async () => {
      const completed = true;
      const category = 'work';

      (Task.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue([])
          })
        })
      });

      (Task.countDocuments as jest.Mock).mockResolvedValue(0);

      await TaskService.getTasks(userId, { completed, category });

      expect(Task.find).toHaveBeenCalledWith({
        userId: expect.any(mongoose.Types.ObjectId),
        completed,
        category
      });
    });
  });

  describe('getTaskById', () => {
    it('should return task by ID', async () => {
      const taskId = testTasks[0]._id!.toString();
      const mockTask = testTasks[0];

      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);

      const result = await TaskService.getTaskById(taskId, userId);

      expect(result).toEqual(mockTask);
      expect(Task.findOne).toHaveBeenCalledWith({
        _id: taskId,
        userId: expect.any(mongoose.Types.ObjectId)
      });
    });

    it('should throw error if task not found', async () => {
      const taskId = new mongoose.Types.ObjectId().toString();

      (Task.findOne as jest.Mock).mockResolvedValue(null);

      await expect(TaskService.getTaskById(taskId, userId)).rejects.toThrow('Task not found');
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = testTasks[0]._id!.toString();
      const updateData = { title: 'Updated Title' };
      const mockTask = {
        ...testTasks[0],
        save: jest.fn().mockResolvedValue({
          ...testTasks[0],
          ...updateData
        })
      };

      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);
      (AIservice.analyzeTask as jest.Mock).mockResolvedValue({
        category: 'work',
        priority: 'medium'
      });

      const result = await TaskService.updateTask(taskId, userId, updateData);

      expect(result.title).toBe(updateData.title);
      expect(mockTask.save).toHaveBeenCalled();
    });

    it('should use AI analysis when title/description changes', async () => {
      const taskId = testTasks[0]._id!.toString();
      const updateData = { title: 'New Title', description: 'New Description' };
      const aiAnalysis = { category: 'learning', priority: 'high' };

      const mockTask = {
        ...testTasks[0],
        save: jest.fn().mockResolvedValue({
          ...testTasks[0],
          ...updateData,
          ...aiAnalysis
        })
      };

      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);
      (AIservice.analyzeTask as jest.Mock).mockResolvedValue(aiAnalysis);

      const result = await TaskService.updateTask(taskId, userId, updateData);

      expect(result.category).toBe(aiAnalysis.category);
      expect(result.priority).toBe(aiAnalysis.priority);
      expect(AIservice.analyzeTask).toHaveBeenCalledWith(
        updateData.title,
        updateData.description
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = testTasks[0]._id!.toString();

      (Task.findOneAndDelete as jest.Mock).mockResolvedValue(testTasks[0]);

      await TaskService.deleteTask(taskId, userId);

      expect(Task.findOneAndDelete).toHaveBeenCalledWith({
        _id: taskId,
        userId: expect.any(mongoose.Types.ObjectId)
      });
    });

    it('should throw error if task not found', async () => {
      const taskId = new mongoose.Types.ObjectId().toString();

      (Task.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(TaskService.deleteTask(taskId, userId)).rejects.toThrow('Task not found');
    });
  });

  describe('getTaskStatistics', () => {
    it('should return task statistics', async () => {
      const mockStats = {
        total: 5,
        completed: 2,
        pending: 3,
        byPriority: [{ _id: 'high', count: 2 }, { _id: 'medium', count: 2 }, { _id: 'low', count: 1 }],
        byCategory: [{ _id: 'work', count: 2 }, { _id: 'shopping', count: 1 }, { _id: 'health', count: 1 }, { _id: 'learning', count: 1 }],
        overdue: 1,
        dueThisWeek: 2
      };

      (Task.aggregate as jest.Mock).mockResolvedValue([mockStats]);
      (AIservice.generateInsights as jest.Mock).mockResolvedValue('Test insights');

      const result = await TaskService.getTaskStatistics(userId);

      expect(result.total).toBe(mockStats.total);
      expect(result.completed).toBe(mockStats.completed);
      expect(result.insights).toBe('Test insights');
      expect(Task.aggregate).toHaveBeenCalled();
    });
  });
});