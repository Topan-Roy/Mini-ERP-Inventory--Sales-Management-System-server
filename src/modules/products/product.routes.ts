import { Router } from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from './product.controller';
import { verifyToken, requireRole } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';

const router = Router();

// Employee can view, Admin/Manager can view too
router.get('/', verifyToken, getProducts);

// Only Admin and Manager can manage products
router.post('/', verifyToken, requireRole('Admin', 'Manager'), upload.single('image'), createProduct);
router.patch('/:id', verifyToken, requireRole('Admin', 'Manager'), upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, requireRole('Admin', 'Manager'), deleteProduct);

export const ProductRoutes = router;
