import { Router, Request, Response } from 'express';
import commentPOST from '../services/SendComment';
import uploadpostPOST from '../services/UploadPostService';
import likepostPOST from '../services/LikePostService';
import deletepostPOST from '../services/DetelePostService';

const router = Router();

router.post('/comment', commentPOST);
router.post('/uploadPost', uploadpostPOST);
router.post('/likePost', likepostPOST);
router.post('/deletePost', deletepostPOST);


export default router;