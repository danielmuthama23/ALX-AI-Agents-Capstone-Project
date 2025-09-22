import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
// import { validateLogin, validateRegistration } from '../middleware/validation'; // Unused imports

/**
 * @function generateToken
 * @description Generate JWT token with proper typing
 */
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return (jwt.sign as any)(
    { id: userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @interface AuthRequest
 * @description Extended Request interface for authentication
 */
interface AuthRequest extends Request {
  user?: any;
}

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation is handled by middleware, so we can proceed directly

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      res.status(409).json({ 
        message: 'User already exists with this email or username' 
      });
      return;
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation is handled by middleware, so we can proceed directly

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    res.json({
      message: 'Profile retrieved successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // Check if new email or username is already taken by another user
    if (email || username) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          { $or: [{ email }, { username }] }
        ]
      });

      if (existingUser) {
        res.status(409).json({ 
          message: 'Email or username already taken' 
        });
        return;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
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
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Change user password
 * @route PUT /api/auth/password
 * @access Private
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters long' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};

/**
 * @desc Logout user (client-side token removal)
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Note: JWT is stateless, so logout is handled client-side by removing the token
    // This endpoint provides a clean way to handle logout on the server if needed
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message 
    });
  }
};