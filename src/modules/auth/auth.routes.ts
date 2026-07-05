import { Router } from 'express';
import { login } from './auth.controller';

const router = Router();

router.post('/login', login);
// Re-implementing /jwt endpoint for backwards compatibility if needed
router.post('/jwt', login);

export const AuthRoutes = router;
