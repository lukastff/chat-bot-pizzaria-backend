import { Router } from 'express';
import { getMessages, postMessage } from '../controllers/messagesController.js';

const router = Router();

router.post('/messages', postMessage);
router.get('/messages', getMessages);

export default router;
