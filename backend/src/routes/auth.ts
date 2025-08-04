import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authRateLimit, checkAccountLockout } from '../middleware/security';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', 
  authRateLimit,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
    body('lastName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
    body('studentId')
      .optional()
      .trim()
      .isLength({ min: 6, max: 12 })
      .withMessage('Student ID must be between 6 and 12 characters')
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage('Student ID can only contain letters and numbers'),
    body('phone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number')
  ], 
  register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', 
  authRateLimit,
  checkAccountLockout,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .exists()
      .withMessage('Password is required')
  ], 
  login
);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, getProfile);

export default router;
