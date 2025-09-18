import User, { IUser } from '../models/User';
import Task from '../models/Task';

/**
 * @class UserService
 * @description Service layer for user operations
 */
export class UserService {
  /**
   * @method getUserProfile
   * @description Get user profile with statistics
   */
  static async getUserProfile(userId: string): Promise<{
    user: IUser;
    stats: {
      totalTasks: number;
      completedTasks: number;
      highPriorityTasks: number;
    };
  }> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Get task statistics
      const taskStats = await Task.aggregate([
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

      return { user, stats };
    } catch (error) {
      throw new Error(`Failed to get user profile: ${(error as Error).message}`);
    }
  }

  /**
   * @method updateUserProfile
   * @description Update user profile
   */
  static async updateUserProfile(
    userId: string,
    updateData: Partial<{
      username: string;
      email: string;
    }>
  ): Promise<IUser> {
    try {
      // Check if new values conflict with existing users
      if (updateData.email || updateData.username) {
        const existingUser = await User.findOne({
          $and: [
            { _id: { $ne: userId } },
            { 
              $or: [
                ...(updateData.email ? [{ email: updateData.email }] : []),
                ...(updateData.username ? [{ username: updateData.username }] : [])
              ]
            }
          ]
        });

        if (existingUser) {
          throw new Error('Email or username already taken');
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Profile update failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method deleteUserAccount
   * @description Delete user account and all associated data
   */
  static async deleteUserAccount(userId: string, password: string): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Delete all user's tasks
      await Task.deleteMany({ userId });

      // Delete user account
      await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Account deletion failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method getUserActivity
   * @description Get user activity summary
   */
  static async getUserActivity(
    userId: string,
    days: number = 30
  ): Promise<Array<{ _id: string; tasksCreated: number; tasksCompleted: number }>> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const activity = await Task.aggregate([
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

      return activity;
    } catch (error) {
      throw new Error(`Failed to get user activity: ${(error as Error).message}`);
    }
  }

  /**
   * @method exportUserData
   * @description Export user data as JSON
   */
  static async exportUserData(userId: string): Promise<{
    user: {
      id: any;
      username: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    };
    tasks: Array<{
      id: any;
      title: string;
      description?: string;
      dueDate?: Date;
      priority: string;
      category: string;
      completed: boolean;
      createdAt: Date;
      updatedAt: Date;
      completedAt?: Date;
    }>;
    exportedAt: Date;
    totalTasks: number;
    completedTasks: number;
  }> {
    try {
      const user = await User.findById(userId);
      const tasks = await Task.find({ userId });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
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
          completedAt: task.completed ? task.updatedAt : undefined
        })),
        exportedAt: new Date(),
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.completed).length
      };
    } catch (error) {
      throw new Error(`Data export failed: ${(error as Error).message}`);
    }
  }

  /**
   * @method searchUsers
   * @description Search users (admin functionality)
   */
  static async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{
    users: IUser[];
    total: number;
    totalPages: number;
  }> {
    try {
      const searchQuery = query
        ? {
            $or: [
              { username: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } }
            ]
          }
        : {};

      const users = await User.find(searchQuery)
        .select('-password')
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(searchQuery);

      return {
        users,
        total,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`User search failed: ${(error as Error).message}`);
    }
  }
}