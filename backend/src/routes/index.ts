import express from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

export default router;