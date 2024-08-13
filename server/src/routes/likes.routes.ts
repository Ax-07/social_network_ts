import { Router } from 'express';
import { likePost, likeComment } from '../controllers/likes.controller';
import { checkAuth } from '../middleware/checkAuth.middelware';

const router = Router();

router.patch('/like-post', checkAuth, likePost);
router.patch('/like-comment', checkAuth, likeComment);

export default router;