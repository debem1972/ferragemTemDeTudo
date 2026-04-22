import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../controllers/productController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/adminMiddleware.js';

const router = Router();

router.get('/products', listProducts);
router.get('/products/:id', getProductById);

router.post('/admin/products', authenticateToken, requireAdmin, createProduct);
router.put('/admin/products/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/admin/products/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;
