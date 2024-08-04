import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';

const followUser = async (req: Request, res: Response) => {
    const { userId, followerId } = req.body;
    if (!userId || !followerId) {
        return res.status(400).send({ message: 'Missing fields' });
    }
    try {
        const user = await db.User.findByPk(userId);
        const follower = await db.User.findByPk(followerId);
        if (!user || !follower) {
            return res.status(404).send({ message: 'User not found' });
        }
        await user.update({ followers: [...(user.followers || []), followerId] });
        await follower.update({ followings: [...follower.followings || [], userId] });

        res.status(200).send({ message: 'User followed successfully' });
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while following the user.');
    }
};

const unfollowUser = async (req: Request, res: Response) => {
    const { userId, followerId } = req.body;
    if (!userId || !followerId) {
        return res.status(400).send({ message: 'Missing fields' });
    }
    try {
        const user = await db.User.findByPk(userId);
        const follower = await db.User.findByPk(followerId);
        if (!user || !follower) {
            return res.status(404).send({ message: 'User not found' });
        }
        await user.update({ followers: user.followers?.filter((id) => id !== followerId) });
        await follower.update({ followings: follower.followings?.filter((id) => id !== userId) });

        res.status(200).send({ message: 'User unfollowed successfully' });
    } catch (error) {
        handleControllerError(res, error, 'An error occurred while unfollowing the user.');
    }
};

export { followUser, unfollowUser };