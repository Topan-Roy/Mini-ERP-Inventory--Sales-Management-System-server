import { Router } from 'express';
import { getDashboardStats } from './dashboard.controller';
import { verifyToken, requireRole } from '../../middlewares/auth';

const router = Router();

// Everyone who is authenticated can view dashboard (or we could restrict to Admin/Manager)
router.get('/', verifyToken, getDashboardStats);

export const DashboardRoutes = router;
