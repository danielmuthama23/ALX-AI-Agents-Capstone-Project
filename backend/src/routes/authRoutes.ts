import express from 'express';
import { register, login, getProfile, updateProfile, changePassword, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, updateProfile);

/**
 * @route   PUT /api/auth/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', authenticate, changePassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/auth/check-email
 * @desc    Check if email is available
 * @access  Public
 */
router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }
    
    const existingUser = await User.findOne({ email: email as string });
    return res.json({ available: !existingUser });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/auth/check-username
 * @desc    Check if username is available
 * @access  Public
 */
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'Username parameter is required' });
    }
    
    const existingUser = await User.findOne({ username: username as string });
    return res.json({ available: !existingUser });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;


