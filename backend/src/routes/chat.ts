import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// @route   GET /api/chat/rooms
// @desc    Get user's chat rooms
// @access  Private
router.get('/rooms', authenticate, (req, res) => {
  res.json({ message: 'Get chat rooms endpoint - to be implemented' });
});

// @route   POST /api/chat/rooms
// @desc    Create a new chat room
// @access  Private
router.post('/rooms', authenticate, (req, res) => {
  res.json({ message: 'Create chat room endpoint - to be implemented' });
});

// @route   GET /api/chat/rooms/:id/messages
// @desc    Get messages from a chat room
// @access  Private
router.get('/rooms/:id/messages', authenticate, (req, res) => {
  res.json({ message: 'Get chat messages endpoint - to be implemented' });
});

export default router;
