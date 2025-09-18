import mongoose from 'mongoose';
import { UserService } from '../../services/userService';
import { testUsers } from '../fixtures/userData';
import { User } from '../../models/User';
import { Task } from '../../models/Task';

// Mock the User and Task models
jest.mock('../../models/User');
jest.mock('../../models/Task');

describe('UserService - Unit Tests', () => {
  const userId = testUsers[0]._id!.toString();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return user profile with statistics', async () => {
      const mockUser = testUsers[0];
      const mockStats = {
        totalTasks: 5,
        completedTasks: 2,
        highPriorityTasks: 1
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Task.aggregate as jest.Mock).mockResolvedValue([mockStats]);

      const result = await UserService.getUserProfile(userId);

      expect(result.user).toEqual(mockUser);
      expect(result.stats).toEqual(mockStats);
      expect(User.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw error if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(UserService.getUserProfile(userId)).rejects.toThrow('User not found');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = { username: 'newusername' };
      const mockUpdatedUser = { ...testUsers[0], ...updateData };

      (User.findOne as jest.Mock).mockResolvedValue(null); // No conflicting user
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await UserService.updateUserProfile(userId, updateData);

      expect(result.username).toBe(updateData.username);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updateData,
        expect.any(Object)
      );
    });

    it('should throw error if email or username is taken', async () => {
      const updateData = { email: 'taken@example.com' };

      (User.findOne as jest.Mock).mockResolvedValue({ _id: new mongoose.Types.ObjectId() }); // Conflicting user exists

      await expect(
        UserService.updateUserProfile(userId, updateData)
      ).rejects.toThrow('Email or username already taken');
    });
  });

  describe('deleteUserAccount', () => {
    it('should delete user account successfully', async () => {
      const password = 'Password123!';
      const mockUser = {
        _id: userId,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn()
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Task.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 5 });
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      await UserService.deleteUserAccount(userId, password);

      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
      expect(Task.deleteMany).toHaveBeenCalledWith({ userId: expect.any(mongoose.Types.ObjectId) });
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });

    it('should throw error if password is incorrect', async () => {
      const password = 'WrongPassword123!';
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        UserService.deleteUserAccount(userId, password)
      ).rejects.toThrow('Invalid password');
    });
  });

  describe('getUserActivity', () => {
    it('should return user activity', async () => {
      const mockActivity = [
        { _id: '2023-12-01', tasksCreated: 2, tasksCompleted: 1 },
        { _id: '2023-12-02', tasksCreated: 1, tasksCompleted: 0 }
      ];

      (Task.aggregate as jest.Mock).mockResolvedValue(mockActivity);

      const result = await UserService.getUserActivity(userId, 7);

      expect(result).toEqual(mockActivity);
      expect(Task.aggregate).toHaveBeenCalled();
    });
  });

  describe('exportUserData', () => {
    it('should export user data successfully', async () => {
      const mockUser = testUsers[0];
      const mockTasks = [
        { _id: new mongoose.Types.ObjectId(), title: 'Task 1', completed: true },
        { _id: new mongoose.Types.ObjectId(), title: 'Task 2', completed: false }
      ];

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Task.find as jest.Mock).mockResolvedValue(mockTasks);

      const result = await UserService.exportUserData(userId);

      expect(result.user).toBeDefined();
      expect(result.tasks).toEqual(mockTasks);
      expect(result.totalTasks).toBe(mockTasks.length);
      expect(result.completedTasks).toBe(mockTasks.filter(t => t.completed).length);
    });

    it('should throw error if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(UserService.exportUserData(userId)).rejects.toThrow('User not found');
    });
  });

  describe('searchUsers', () => {
    it('should search users with query', async () => {
      const query = 'test';
      const mockUsers = [testUsers[0], testUsers[1]];
      const total = mockUsers.length;

      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockUsers)
            })
          })
        })
      });

      (User.countDocuments as jest.Mock).mockResolvedValue(total);

      const result = await UserService.searchUsers(query);

      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(total);
      expect(User.find).toHaveBeenCalledWith({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      });
    });
  });
});