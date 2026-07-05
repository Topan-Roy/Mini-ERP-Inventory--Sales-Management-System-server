import { Router } from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from './customer.controller';
import { verifyToken, requireRole } from '../../middlewares/auth';

const router = Router();

// All roles can view customers
router.get('/', verifyToken, getCustomers);
router.get('/:id', verifyToken, getCustomerById);

// Admin and Manager can manage customers
router.post('/', verifyToken, requireRole('Admin', 'Manager'), createCustomer);
router.patch('/:id', verifyToken, requireRole('Admin', 'Manager'), updateCustomer);
router.delete('/:id', verifyToken, requireRole('Admin'), deleteCustomer);

export const CustomerRoutes = router;
