import { Router } from 'express';
import newmessage from '@server/services/MessageService/NewMessage';

const router = Router();

// router.post('/createConversation', );
router.post('/newmessage', newmessage);


export default router;