import { Request, Response } from 'express';
import User from '../models/User';
import Task from '../models/Task';

/**
 * @interface AuthRequest
 * @description Extended Request interface for authentication
 */
interface AuthRequest extends Request {
  user?: any;
}

/**
 * @desc Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get some basic stats for the dashboard
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

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      stats
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    // Check if new values are provided
    if (!username && !email) {
      res.status(400).json({ message: 'At least one field (username or email) is required' });
      return;
    }

    // Check if email or username is already taken by another user
    if (email || username) {
      // Build the OR condition dynamically
      const orConditions = [];
      if (email) orConditions.push({ email });
      if (username) orConditions.push({ username });

      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          { $or: orConditions }
        ]
      });

      if (existingUser) {
        res.status(409).json({ 
          message: 'Email or username already taken' 
        });
        return;
      }
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Delete user account
 * @route DELETE /api/users/account
 * @access Private
 */
export const deleteUserAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    // Verify password before deletion (optional additional security)
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ message: 'Password is required for account deletion' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    // Delete all user's tasks first
    await Task.deleteMany({ userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and all associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user account error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Get user activity summary
 * @route GET /api/users/activity
 * @access Private
 */
export const getUserActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    // Get tasks created and completed in the specified period
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

    res.json(activity);
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Export user data
 * @route GET /api/users/export
 * @access Private
 */
export const exportUserData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    const tasks = await Task.find({ userId });

    const exportData = {
      user: {
        id: user?._id,
        username: user?.username,
        email: user?.email,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt
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
        completedAt: task.completed ? task.updatedAt : null
      })),
      exportedAt: new Date(),
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.completed).length
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=user-data-export.json');
    
    res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    console.error('Export user data error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};