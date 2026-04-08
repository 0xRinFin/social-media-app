import express, { Router } from 'express';

// uhh... \\
import ProfileController from '../controllers/ProfileController';

// radi \\
const router = Router();

// ROUTING \\
router.use('/api/ProfileController', ProfileController);

// EXPORTING \\
export default router;