// app/core/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// 公共路由
router.post('/api/users/register', userController.register);
router.post('/api/users/login', userController.login);

// 受保护的路由
router.get('/api/users/me', protect, userController.getCurrentUser);

export default router;