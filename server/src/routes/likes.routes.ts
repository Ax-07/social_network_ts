import { Router } from 'express';
import { likePost, unlikePost, dislikePost, unDislikePost, likeComment, unlikeComment } from '../controllers/likes.controller';

const router = Router();

router.patch('/like-post', likePost);
router.patch('/unlike-post', unlikePost);
router.patch('/dislike-post', dislikePost);
router.patch('/undislike-post', unDislikePost);
router.patch('/like-comment', likeComment);
router.patch('/unlike-comment', unlikeComment);

export default router;