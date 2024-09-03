import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";
import { apiError, apiSuccess } from "../utils/functions/apiResponses";

const addToBookmarks = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { postId } = req.body;

  if (!userId || !postId) {
    return apiError(res, "Missing fields", 400);
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return apiError(res, "User not found", 404);
    }

    const post = await db.Post.findByPk(postId);
    if (!post) {
      return apiError(res, "Post not found", 404);
    }

    // Vérifier si le post est déjà dans les bookmarks de l'utilisateur
    const bookmark = await db.UserBookmarks.findOne({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (bookmark) {
      // Si le post est déjà dans les bookmarks, le retirer
      await bookmark.destroy();
      return apiSuccess(res, "Post removed from bookmarks successfully");
    } else {
      // Sinon, ajouter le post aux bookmarks
      await db.UserBookmarks.create({
        userId: userId,
        postId: postId,
      });
      return apiSuccess(res, "Post added to bookmarks successfully");
    }
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while adding post to bookmarks"
    );
  }
};

const getBookmarkedPosts = async (req: Request, res: Response) => {
  const userId = req.query.id as string;
  if (!userId) {
    return apiError(res, 'User ID is required', 400);
  }

  try {
    // Vérifiez que l'utilisateur existe
    const user = await db.User.findByPk(userId);
    if (!user) {
      return apiError(res, 'User not found', 404);
    }

    // Récupérez les posts signés par l'utilisateur via la table de jonction
    const bookmarkedPosts = await db.Post.findAll({
      include: [
        {
          model: db.UserBookmarks,
          as: 'bookmarks',
          where: { userId: userId },
          attributes: [], // Ne pas inclure les attributs de la table de jonction dans la réponse
        }
      ]
    });

    // Si aucun post n'est trouvé, retourner un tableau vide
    if (bookmarkedPosts.length === 0) {
      return apiSuccess(res, `No bookmarked posts found for user ${userId}`, [], 200);
    }

    return apiSuccess(res, `Bookmarked posts for user ${userId}`, bookmarkedPosts, 200);

  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while getting bookmarked posts.');
  }
};

export { addToBookmarks, getBookmarkedPosts };
