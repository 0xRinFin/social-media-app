import { Router, Request, Response } from 'express';
import signupPOST from "../services/SignUpService";
import changeDetailPOST from "../services/ChangeProfileService";
import followPOST from "@/server/services/FollowProfileService";
import uploadpostPOST from "@/server/services/UploadPostService";

const router = Router();

// POST /api/ProfileController/signup { email, handle, password, display_name }
router.post('/signup', signupPOST);
router.post('/changeDetail', changeDetailPOST);
router.post('/follow', followPOST);
router.post('/uploadPost', uploadpostPOST);

export default router;