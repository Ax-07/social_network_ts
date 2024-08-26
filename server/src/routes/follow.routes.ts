import { Router } from 'express';
import { followUser, getFollowersNames } from '../controllers/follow.controller';
import { checkAuth } from '../middleware/checkAuth.middelware';

const router = Router();

router.patch('/follow', checkAuth, followUser);
router.get('/users/:id/followers', checkAuth, getFollowersNames);

export default router;