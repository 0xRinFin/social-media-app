import express, { Router } from 'express';

// uhh... \\
import ProfileController from '../controllers/ProfileController';
import PostController from '../controllers/PostController';

// radi \\
const router = Router();

// ROUTING \\
router.use('/api/ProfileController', ProfileController);
router.use('/api/PostController', PostController);

// EXPORTING \\
export default router;