import { Router } from 'express';
import { followUser, unfollowUser } from '../controllers/follow.controller';
import { checkAuth } from '../middleware/checkAuth.middelware';

const router = Router();

router.patch('/follow', checkAuth, followUser);
router.patch('/unfollow', checkAuth, unfollowUser);

export default router;