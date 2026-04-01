import { Router } from 'express';
import { login, register, getProfile, logout } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validateMiddleware';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

router.get('/profile', protect, getProfile);
router.post('/logout',  protect, logout);

export default router;