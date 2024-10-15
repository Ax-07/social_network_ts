import { Request, Response } from "express";
import { handleControllerError } from "../../../utils/errors/controllers.error";
import { apiError, apiSuccess } from "../../../utils/functions/apiResponses";
import { io } from "../../notifications/services";
import db from "../../../db/models";
import { Op } from "sequelize";

const followUser = async (req: Request, res: Response) => {
  // followerId represent l'id de l'utilisateur connecter
  // followedId celui de l'utilisateur qu'il veut suivre
  const { followerId, followedId } = req.body;

  if (!followerId || !followedId) {
    return apiError(res, "Missing fields", 400);
  }

  try {
    const follower = await db.User.findByPk(followerId);
    const followed = await db.User.findByPk(followedId);

    if (!follower || !followed) {
      return apiError(res, "User not found", 404);
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
        type: "unfollow",
        message: `${follower.username} unfollowed you`,
      });

      if (response) {
        io.to(followedId).emit("notification", {
          id: response.id,
          userId: followedId,
          senderId: followerId,
          type: "unfollow",
          message: `${follower.username} unfollowed you`,
          createdAt: response.createdAt,
        });
      }

      // Récupérer les listes de followings et followers
      const updatedFollowings = await db.User.findAll({
        where: { id: followerId },
        include: {
          model: db.User,
          as: "followings",
          through: { attributes: [] }, // Ignore la table de jonction
          attributes: ["id", "username", "profilPicture"],
        },
      });

      const updatedFollowers = await db.User.findAll({
        where: { id: followedId },
        include: {
          model: db.User,
          as: "followers",
          through: { attributes: [] },
          attributes: ["id", "username", "profilPicture"],
        },
      });

      return apiSuccess(res, "User unfollowed successfully", {
        followings: updatedFollowings[0]?.get("followings"),
        followers: updatedFollowers[0]?.get("followers"),
      });
    } else {
      // Follow: créer un nouvel abonnement
      await db.UserFollowers.create({
        followerId: followerId,
        followedId: followedId,
      });

      const response = await db.Notification.create({
        userId: followedId,
        senderId: followerId,
        type: "follow",
        message: `${follower.username} started following you`,
      });

      if (response) {
        io.to(followedId).emit("notification", {
          id: response.id,
          userId: followedId,
          senderId: followerId,
          type: "follow",
          message: `${follower.username} started following you`,
          createdAt: response.createdAt,
        });
      }

      // Récupérer les listes de followings et followers
      const updatedFollowings = await db.User.findAll({
        where: { id: followerId },
        include: {
          model: db.User,
          as: "followings",
          through: { attributes: [] },
          attributes: ["id", "username", "profilPicture"],
        },
      });

      const updatedFollowers = await db.User.findAll({
        where: { id: followedId },
        include: {
          model: db.User,
          as: "followers",
          through: { attributes: [] },
          attributes: ["id", "username", "profilPicture"],
        },
      });
      
      return apiSuccess(res, "User followed successfully", {
        followings: updatedFollowings[0]?.get("followings"),
        followers: updatedFollowers[0]?.get("followers"),
      });
    }
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while following the user."
    );
  }
};

const getFollowersNames = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return apiError(res, "Missing fields", 400);
  }

  try {
    const user = await db.User.findByPk(id);

    if (!user) {
      return apiError(res, "User not found", 404);
    }

    // Récupération des noms des abonnés à partir de la table de jonction UserFollowers
    const followers = await db.UserFollowers.findAll({
      where: { followedId: id },
      include: [
        { model: db.User, as: "follower", attributes: ["id", "username"] },
      ],
    });

    const followersNames = await Promise.all(
      followers.map(async (follower) => {
        const followerName = await db.User.findByPk(follower.followerId);
        return followerName?.username ?? "Unknown";
      })
    );

    return apiSuccess(res, "Followers found successfully", { followersNames });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting followers."
    );
  }
};

const getWhoToFollow = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Vérifier si l'ID de l'utilisateur est présent dans la requête
  if (!id) {
    return apiError(res, "Missing fields", 400);
  }

  try {
    // Récupérer l'utilisateur en question
    const user = await db.User.findByPk(id);

    // Si l'utilisateur n'existe pas, retourner une erreur 404
    if (!user) {
      return apiError(res, "User not found", 404);
    }

    // Récupérer les abonnements et abonnés de l'utilisateur dans une seule requête
    const followingsAndFollowers = await db.UserFollowers.findAll({
      where: {
        [Op.or]: [
          { followerId: id }, // Abonnements (utilisateurs suivis)
          { followedId: id }, // Abonnés (utilisateurs qui suivent)
        ],
      },
      attributes: ["followerId", "followedId"],
    });

    // Extraire les IDs des abonnements et des abonnés
    const followingsIds = followingsAndFollowers
      .filter((f) => f.followerId === id)
      .map((f) => f.followedId);
    const followersIds = followingsAndFollowers
      .filter((f) => f.followedId === id)
      .map((f) => f.followerId);

    // Récupérer les abonnements des abonnés et abonnés des abonnements en une seule requête
    const relatedUsers = await db.UserFollowers.findAll({
      where: {
        [Op.or]: [
          { followerId: followersIds }, // Les abonnés de mes abonnés
          { followedId: followingsIds }, // Les abonnements de mes abonnements
        ],
      },
      attributes: ["followerId", "followedId"],
    });

    // Extraire les IDs des utilisateurs reliés et les rendre uniques
    let relatedUserIds = [
      ...relatedUsers.map((r) => r.followerId),
      ...relatedUsers.map((r) => r.followedId),
    ];

    // Filtrer les doublons, l'utilisateur actuel, et ceux déjà suivis
    relatedUserIds = [...new Set(relatedUserIds)]
      .filter((userId) => userId !== id)
      .filter((userId) => !followingsIds.includes(userId));

    // Récupérer les informations des utilisateurs à suivre
    const userToFollow = await db.User.findAll({
      where: { id: relatedUserIds },
      attributes: ["id", "username", "profilPicture"],
    });

    // Retourner la liste des utilisateurs à suivre
    return apiSuccess(res, "Users to follow found successfully", userToFollow, 200);
  } catch (error) {
    // Gérer les erreurs via une fonction utilitaire pour les erreurs contrôleur
    return handleControllerError(
      res,
      error,
      "An error occurred while getting followers."
    );
  }
};

export { followUser, getFollowersNames, getWhoToFollow };
