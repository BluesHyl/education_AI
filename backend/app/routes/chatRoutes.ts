import { Router } from 'express';
import { chatCompletion } from '../controllers/chatController';

const router = Router();

router.post('/completions', chatCompletion);

export default router;