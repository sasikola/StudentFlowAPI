import { Router } from 'express';
import {
  getServiceById,
  createService,
  updateService,
  addSession,
} from '../controllers/serviceController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/:id',          getServiceById);
router.post('/',            createService);
router.put('/:id',          updateService);
router.post('/:id/sessions', addSession);

export default router;