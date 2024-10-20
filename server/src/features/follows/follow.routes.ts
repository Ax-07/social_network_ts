import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.middelware';
import { followUser, getFollowersNames, getWhoToFollow } from './controllers/follow.controller';

const router = Router();

router.patch('/follow', checkAuth, followUser);
router.get('/users/:id/followers', checkAuth, getFollowersNames);
router.get('/users/:id/whoToFollow', checkAuth, getWhoToFollow);

export default router;