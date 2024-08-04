import { Router } from 'express';
import { followUser, unfollowUser } from '../controllers/follow.controller';

const router = Router();

router.patch('/follow', followUser);
router.patch('/unfollow', unfollowUser);

export default router;