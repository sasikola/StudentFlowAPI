import { Router } from 'express';
import {
  getAllPayments,
  createPayment,
  updatePayment,
  getPaymentSummary,
} from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/',          getAllPayments);
router.get('/summary',   getPaymentSummary);
router.post('/',         createPayment);
router.put('/:id',       updatePayment);

export default router;