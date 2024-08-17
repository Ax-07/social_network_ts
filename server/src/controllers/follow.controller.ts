import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';

const followUser = async (req: Request, res: Response) => {
    const { userId, followerId } = req.body;
    if (!userId || !followerId) {
        return apiError(res, 'Missing fields', 400);
    }
    try {
        const user = await db.User.findByPk(userId);
        const follower = await db.User.findByPk(followerId);
        if (!user || !follower) {
            return apiError(res, 'User not found', 404);
        }
        await user.update({ followers: [...(user.followers || []), followerId] });
        await follower.update({ followings: [...follower.followings || [], userId] });

        return apiSuccess(res, 'User followed successfully', { userId, followerId });
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while following the user.');
    }
};

const unfollowUser = async (req: Request, res: Response) => {
    const { userId, followerId } = req.body;
    if (!userId || !followerId) {
        return apiError(res, 'Missing fields', 400);
    }
    try {
        const user = await db.User.findByPk(userId);
        const follower = await db.User.findByPk(followerId);
        if (!user || !follower) {
            return apiError(res, 'User not found', 404);
        }
        await user.update({ followers: user.followers?.filter((id) => id !== followerId) });
        await follower.update({ followings: follower.followings?.filter((id) => id !== userId) });

        return apiSuccess(res, 'User unfollowed successfully', { userId, followerId });
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while unfollowing the user.');
    }
};

export { followUser, unfollowUser };