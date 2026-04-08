import { Router, Request, Response } from 'express';
import signupPOST from "../services/SignUpService";

const router = Router();

// POST /api/ProfileController/signup { email, handle, password, display_name }
router.post('/signup', signupPOST);

export default router;