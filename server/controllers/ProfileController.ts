import { Router, Request, Response } from 'express';
import signupPOST from "../services/SignUpService";
import changeDetailPOST from "../services/ChangeProfileService";
import followPOST from "@/server/services/FollowProfileService";

const router = Router();

// POST /api/ProfileController/signup { email, handle, password, display_name }
router.post('/signup', signupPOST);
router.post('/changeDetail', changeDetailPOST);
router.post('/follow', followPOST);

export default router;