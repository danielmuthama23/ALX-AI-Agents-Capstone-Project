import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUserActivity,
  exportUserData
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile with statistics
 * @access  Private
 */
router.get('/profile', getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', updateUserProfile);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account and all associated data
 * @access  Private
 */
router.delete('/account', deleteUserAccount);

/**
 * @route   GET /api/users/activity
 * @desc    Get user activity summary
 * @access  Private
 * @query   days (default: 30)
 */
router.get('/activity', getUserActivity);

/**
 * @route   GET /api/users/export
 * @desc    Export user data as JSON file
 * @access  Private
 */
router.get('/export', exportUserData);

export default router;