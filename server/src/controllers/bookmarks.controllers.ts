import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";
import { apiError, apiSuccess } from "../utils/functions/apiResponses";

const addToBookmarks = async (req: Request, res: Response) => {
  const { userId, postId } = req.body;

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
      const updatedBookmarks  = await db.UserBookmarks.findAll({ where: { userId: userId }, attributes: ['postId'] });
      return apiSuccess(res, "Post removed from bookmarks successfully", {bookmarks: updatedBookmarks}, 200);
    } else {
      // Sinon, ajouter le post aux bookmarks
      await db.UserBookmarks.create({
        userId: userId,
        postId: postId,
      });
      const updatedBookmarks  = await db.UserBookmarks.findAll({ where: { userId: userId }, attributes: ['postId'] });
      return apiSuccess(res, "Post added to bookmarks successfully", {bookmarks: updatedBookmarks}, 201);
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

    // Récupérer les posts bookmarkés par l'utilisateur via la table de jonction UserBookmarks
    const bookmarkedPosts = await db.Post.findAll();

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
