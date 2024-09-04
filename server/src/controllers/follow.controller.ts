import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';
import { io } from '../services/notifications';

const followUser = async (req: Request, res: Response) => {
    // followerId represent l'id de l'utilisateur connecter
    // followedId celui de l'utilisateur qu'il veut suivre
    const { followerId, followedId } = req.body; 

    if (!followerId || !followedId) {
        return apiError(res, 'Missing fields', 400);
    }

    try {
        const follower = await db.User.findByPk(followerId);
        const followed = await db.User.findByPk(followedId);

        if (!follower || !followed) {
            return apiError(res, 'User not found', 404);
        }

        // Vérification que l'utilisateur n'essaie pas de se suivre lui-même
        if (followerId === followedId) {
            return apiError(res, "You can't follow yourself", 400);
        }

        // Vérification si l'utilisateur suit déjà la personne
        const existingFollow = await db.UserFollowers.findOne({
            where: { followerId: followerId, followedId: followedId },
        });

        if (existingFollow) {
            // Unfollow: retirer l'abonnement
            await existingFollow.destroy();

            const response = await db.Notification.create({
                userId: followedId,
                senderId: followerId,
                type: 'unfollow',
                message: `${follower.username} unfollowed you`,
            });

            if (response) {
                io.to(followedId).emit('notification', {
                    id: response.id,
                    userId: followedId,
                    senderId: followerId,
                    type: 'unfollow',
                    message: `${follower.username} unfollowed you`,
                    createdAt: response.createdAt,
                });
            }

             // Récupérer les listes de followings et followers
             const updatedFollowings = await db.User.findAll({
                include: {
                    model: db.User, 
                    as: 'followings', 
                    through: { attributes: [] }, // Ignore la table de jonction
                    attributes: ['id', 'username', 'profilPicture'],
                },
                where: { id: followerId }
            });

            const updatedFollowers = await db.User.findAll({
                include: {
                    model: db.User, 
                    as: 'followers', 
                    through: { attributes: [] },
                    attributes: ['id', 'username', 'profilPicture'],
                },
                where: { id: followedId }
            });

            return apiSuccess(res, 'User unfollowed successfully', {
                followings: updatedFollowings[0]?.get('followings'),
                followers: updatedFollowers[0]?.get('followers'),
            });
        } else {
            // Follow: créer un nouvel abonnement
            await db.UserFollowers.create({ followerId: followerId, followedId: followedId });

            const response = await db.Notification.create({
                userId: followedId,
                senderId: followerId,
                type: 'follow',
                message: `${follower.username} started following you`,
            });

            if (response) {
                io.to(followedId).emit('notification', {
                    id: response.id,
                    userId: followedId,
                    senderId: followerId,
                    type: 'follow',
                    message: `${follower.username} started following you`,
                    createdAt: response.createdAt,
                });
            }

            // Récupérer les listes de followings et followers
            const updatedFollowings = await db.User.findAll({
                include: {
                    model: db.User, 
                    as: 'followings', 
                    through: { attributes: [] },
                    attributes: ['id', 'username', 'profilPicture'],
                },
                where: { id: followerId }
            });

            const updatedFollowers = await db.User.findAll({
                include: {
                    model: db.User, 
                    as: 'followers', 
                    through: { attributes: [] },
                    attributes: ['id', 'username', 'profilPicture'],
                },
                where: { id: followedId }
            });
            return apiSuccess(res, 'User followed successfully', {
                followings: updatedFollowings[0]?.get('followings'),
                followers: updatedFollowers[0]?.get('followers'),
            });
        }
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while following the user.');
    }
};

const getFollowersNames = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return apiError(res, 'Missing fields', 400);
    }

    try {
        const user = await db.User.findByPk(id);

        if (!user) {
            return apiError(res, 'User not found', 404);
        }

        // Récupération des noms des abonnés à partir de la table de jonction UserFollowers
        const followers = await db.UserFollowers.findAll({
            where: { followerId: id },
            include: [{ model: db.User, as: 'follower', attributes: ['username'] }],
        });

        const followersNames = await Promise.all(
            followers.map(async (follower) => {
                const followerName = await db.User.findByPk(follower.followerId);
                return followerName?.username ?? 'Unknown';
            })
        );

        return apiSuccess(res, 'Followers found successfully', { followersNames });
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while getting followers.');
    }
};

export { followUser, getFollowersNames };