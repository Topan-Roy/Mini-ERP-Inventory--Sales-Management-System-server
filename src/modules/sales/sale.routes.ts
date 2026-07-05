import { Router } from 'express';
import { createSale } from './sale.controller';
import { verifyToken, requireRole } from '../../middlewares/auth';

const router = Router();

// Admin, Manager, and Employee can create sales
router.post('/', verifyToken, requireRole('Admin', 'Manager', 'Employee'), createSale);

export const SaleRoutes = router;
