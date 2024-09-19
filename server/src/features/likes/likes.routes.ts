import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.middelware';
import { likePost, likeComment } from './controllers/likes.controller';

const router = Router();

router.patch('/like-post', checkAuth, likePost);
router.patch('/like-comment', checkAuth, likeComment);

export default router;