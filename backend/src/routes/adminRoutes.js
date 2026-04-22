import { Router } from 'express';
import { getAdminProfile } from '../controllers/adminController.js';
import { requireAdmin } from '../middlewares/adminMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/admin/me', authenticateToken, requireAdmin, getAdminProfile);

export default router;
