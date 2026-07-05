import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

export const AuthRoutes = router;
