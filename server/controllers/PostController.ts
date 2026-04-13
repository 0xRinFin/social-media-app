import { Router, Request, Response } from 'express';
import commentPOST from '../services/PostService/SendComment';
import uploadpostPOST from '../services/PostService/UploadPost';
import likepostPOST from '../services/PostService/LikePost';
import deletepostPOST from '../services/PostService/DeletePost';

const router = Router();

router.post('/comment', commentPOST);
router.post('/uploadPost', uploadpostPOST);
router.post('/likePost', likepostPOST);
router.delete('/deletePost', deletepostPOST);


export default router;