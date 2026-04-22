import express, { Router } from 'express';

// uhh... \\
import ProfileController from '../controllers/ProfileController';
import PostController from '../controllers/PostController';
import MessageController from '../controllers/MessageController';
import { supabase } from '../utils/supabase';

// radi \\
const router = Router();

// ROUTING \\
router.use('/api/ProfileController', ProfileController);
router.use('/api/PostController', PostController);
router.use('/api/MessageController', MessageController);

const data = await supabase.auth.admin.updateUserById("213f730b-356c-4a80-95f7-2043b1369a71", {
  password: "radi123",
})
console.log("uhhh", data)

// EXPORTING \\
export default router;