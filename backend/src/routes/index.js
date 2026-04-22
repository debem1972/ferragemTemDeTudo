import { Router } from 'express';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import healthRoutes from './healthRoutes.js';
import productRoutes from './productRoutes.js';

const router = Router();

router.use(adminRoutes);
router.use(authRoutes);
router.use(healthRoutes);
router.use(productRoutes);

export default router;
