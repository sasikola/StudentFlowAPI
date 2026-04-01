import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';
import { getServicesByStudent } from '../controllers/serviceController';
import { getPaymentsByStudent } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validateMiddleware';

const router = Router();

// All routes protected
router.use(protect);

router.get('/',    getStudents);
router.post('/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone required'),
    body('serviceType').notEmpty().withMessage('Service type is required'),
    body('feeAmount').isNumeric().withMessage('Fee amount must be a number'),
    body('paymentMode').notEmpty().withMessage('Payment mode is required'),
    body('startDate').notEmpty().withMessage('Start date is required'),
    validate,
  ],
  createStudent
);

router.get('/:id',    getStudentById);
router.put('/:id',    updateStudent);
router.delete('/:id', deleteStudent);

// Nested routes
router.get('/:studentId/services', getServicesByStudent);
router.get('/:studentId/payments', getPaymentsByStudent);

export default router;