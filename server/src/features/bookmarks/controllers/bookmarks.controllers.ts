import { Request, Response } from "express";
import db from "../../../db/models";
import { handleControllerError } from "../../../utils/errors/controllers.error";
import { apiError, apiSuccess } from "../../../utils/functions/apiResponses";


const addToBookmarks = async (req: Request, res: Response) => {
  const { userId, postId, commentId } = req.body;

  if (!userId || (!postId && !commentId) || (postId && commentId)) {
    return apiError(res, "Invalid fields. You must provide either a postId or a commentId, but not both.", 400);
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return apiError(res, "User not found", 404);
    }

    if (postId) {
      const post = await db.Post.findByPk(postId);
      if (!post) {
        return apiError(res, "Post not found", 404);
      }
    } else if (commentId) {
      const comment = await db.Comment.findByPk(commentId);
      if (!comment) {
        return apiError(res, "Comment not found", 404);
      }
    }

    // Vérifier si le post est déjà dans les bookmarks de l'utilisateur
    const bookmark = await db.UserBookmarks.findOne({
      where: {
        userId,
        postId: postId || null,
        commentId: commentId || null,
      },
    });

    if (bookmark) {
      // Si le post/commentaire est déjà dans les bookmarks, le retirer
      await bookmark.destroy();
      const updatedBookmarks = await db.UserBookmarks.findAll({ where: { userId }, attributes: ['postId', 'commentId'] });
      return apiSuccess(res, "Bookmark removed successfully", { bookmarks: updatedBookmarks }, 200);
    } else {
      // Sinon, ajouter le post/commentaire aux bookmarks
      await db.UserBookmarks.create({
        userId,
        postId: postId || null,
        commentId: commentId || null,
      });
      const updatedBookmarks = await db.UserBookmarks.findAll({ where: { userId }, attributes: ['postId', 'commentId'] });
      return apiSuccess(res, "Bookmark added successfully", { bookmarks: updatedBookmarks }, 201);
    }
  } catch (error) {
    return handleControllerError(res, error, "An error occurred while adding to bookmarks.");
  }
};

const getBookmarks = async (req: Request, res: Response) => {
  const userId = req.params.id as string;
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
    const allBookmarkedItem = await db.UserBookmarks.findAll({ 
      where: { userId },
      include: [
        {
          model: db.Post,
          as: 'post',
          include: [
            {
              model: db.Question,
              as: 'question',
            }
          ]
        },
        {
          model: db.Comment,
          as: 'comment',
        },
      ],
    });

    // Si aucun post n'est trouvé, retourner un tableau vide
    if (allBookmarkedItem.length === 0 ) {
      return apiSuccess(res, `No bookmarked posts found for user ${userId}`, [], 200);
    }

    return apiSuccess(res, `Bookmarked posts for user ${userId}`, allBookmarkedItem, 200);

  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while getting bookmarked posts.');
  }
};

export { addToBookmarks, getBookmarks };
