import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'User profile endpoint - to be implemented' });
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, (req, res) => {
  res.json({ message: 'Update user profile endpoint - to be implemented' });
});

export default router;
