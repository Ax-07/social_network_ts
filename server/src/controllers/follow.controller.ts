import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';

const followUser = async (req: Request, res: Response) => {
    const { userId, followerId } = req.body;

    // Vérification de la présence des champs nécessaires
    if (!userId || !followerId) {
        return apiError(res, 'Missing fields', 400);
    }

    try {
        // Récupération des utilisateurs par leurs IDs
        const user = await db.User.findByPk(userId);
        const follower = await db.User.findByPk(followerId);

        // Vérification de l'existence des utilisateurs
        if (!user || !follower) {
            return apiError(res, 'User not found', 404);
        }

        // Récupération des listes de suivis et abonnés
        let followings = user.followings || [];
        let followers = follower.followers || [];

        // Vérification si l'utilisateur suit déjà le follower
        const isFollowing = followings.includes(followerId);

        // Vérification si le follower est déjà suivi par l'utilisateur
        const isFollower = followers.includes(userId);

        // vérification que l'utilisateur n'essaie pas de se suivre lui même
        if ( userId === followerId ) {
            return apiError(res, "You can't follow yourself", 400);
        }

        // Si l'utilisateur ne suit pas le follower
        if (!isFollowing && !isFollower) {
            // Ajout du follower à la liste des abonnements de l'utilisateur
            followings = [...followings, followerId];
            // Ajout de l'utilisateur à la liste des abonnés du follower
            followers = [...followers, userId];

            await user.update({ followings });
            await follower.update({ followers });
        } else if (isFollowing && isFollower) {
            // Si l'utilisateur suit déjà le follower
            // Retrait du follower de la liste des abonnements de l'utilisateur
            followings = followings.filter((id) => id !== followerId);
            // Retrait de l'utilisateur de la liste des abonnés du follower
            followers = followers.filter((id) => id !== userId);

            await user.update({ followings });
            await follower.update({ followers });
        }

        return apiSuccess(res, 'User followed successfully', { followings: user.followings, followers: follower.followers });
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

        // Récupération des noms des abonnés
        const followersNames = await Promise.all(
            (user.followers ?? []).map(async (followerId: string) => {
                const follower = await db.User.findByPk(followerId);
                return follower?.username || 'Unknown'; // On retourne 'Unknown' si l'utilisateur n'est pas trouvé
            })
        );

        return apiSuccess(res, 'Followers found successfully', { followersNames });
    } catch (error) {
        return handleControllerError(res, error, 'An error occurred while getting followers.');
    }
}


export { followUser, getFollowersNames };