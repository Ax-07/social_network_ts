import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.middelware';
import { followUser, getFollowersNames } from './controllers/follow.controller';

const router = Router();

router.patch('/follow', checkAuth, followUser);
router.get('/users/:id/followers', checkAuth, getFollowersNames);

export default router;