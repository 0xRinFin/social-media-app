import { Router, Request, Response } from 'express';
import signupPOST from "../services/ProfileService/SignUp";
import changeDetailPOST from "../services/ProfileService/ChangeProfile";
import followPOST from "@/server/services/ProfileService/FollowProfile";

const router = Router();

// POST /api/ProfileController/signup { email, handle, password, display_name }
router.post('/signup', signupPOST);
router.post('/changeDetail', changeDetailPOST);
router.post('/follow', followPOST);

export default router;