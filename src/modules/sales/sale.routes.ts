import { Router } from 'express';
import { createSale, getSales, getSaleById } from './sale.controller';
import { verifyToken, requireRole } from '../../middlewares/auth';

const router = Router();

// Admin, Manager, Employee can all view and create sales
router.get('/', verifyToken, getSales);
router.get('/:id', verifyToken, getSaleById);
router.post('/', verifyToken, requireRole('Admin', 'Manager', 'Employee'), createSale);

export const SaleRoutes = router;
