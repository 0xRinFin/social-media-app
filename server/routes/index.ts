import express, { Router } from 'express';

// uhh... \\
import ProfileController from '../controllers/ProfileController';
import PostController from '../controllers/PostController';
import MessageController from '../controllers/MessageController';

// radi \\
const router = Router();

// ROUTING \\
router.use('/api/ProfileController', ProfileController);
router.use('/api/PostController', PostController);
router.use('/api/MessageController', MessageController);

// EXPORTING \\
export default router;