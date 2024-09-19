import { Request, Response } from "express";
import { DatabaseError } from "sequelize";
import db from "../../../db/models";
import { handleControllerError } from "../../../utils/errors/controllers.error";
import { apiError, apiSuccess } from "../../../utils/functions/apiResponses";
import { createCommentOnPost } from "../utils/createCommentOnPost";
import { createReplyOnComment } from "../utils/createReplyOnComment ";
import { handleRepost } from "../utils/handleRepost ";
import validateCommentEntry from "../validations/validateCommentEntry";


/**
 * Contrôleur pour créer un commentaire ou une réponse à un commentaire existant.
 * Cette fonction gère la création de commentaires sur un post ainsi que les réponses à des commentaires.
 * Elle inclut la validation des données, la gestion des transactions de base de données, et des tentatives de réexécution en cas de blocage de la base de données.
 *
 * @async
 * @function createComment
 * @param {Request} req - Objet requête d'Express contenant les données du nouveau commentaire.
 * @param {Response} res - Objet réponse d'Express utilisé pour renvoyer la réponse au client.
 * 
 * @property {string} postId - ID du post à commenter (si le commentaire est sur un post).
 * @property {string} commentId - ID du commentaire à répondre (si c'est une réponse à un commentaire).
 * @property {string} userId - ID de l'utilisateur créant le commentaire.
 * @property {string} content - Contenu du commentaire.
 * @property {string} commentedPostId - (Optionnel) ID d'un post reposté sur lequel on commente.
 * @property {string} commentedCommentId - (Optionnel) ID d'un commentaire reposté sur lequel on commente.
 * 
 * @property {string} res.locals.filePath - Chemin d'accès à un fichier média associé au commentaire.
 * 
 * @returns {Promise<void>} Renvoie une réponse HTTP. En cas de succès, la réponse contient l'objet du commentaire créé. 
 * En cas d'échec, un message d'erreur est renvoyé avec le code HTTP approprié.
 *
 * @description
 * 1. Valide les données d'entrée en utilisant `validateCommentEntry`.
 * 2. Vérifie si l'utilisateur existe dans la base de données.
 * 3. Tente de créer le commentaire dans une transaction, avec jusqu'à 5 tentatives en cas de blocage de la base de données (SQLITE_BUSY).
 * 4. Gère différents scénarios : commenter un post, répondre à un commentaire, ou commenter un repost.
 * 5. Valide la transaction si tout se passe bien ou annule en cas d'erreur.
 * 6. Renvoie une réponse appropriée au client en fonction du résultat.
 *
 * @throws {Error} En cas d'erreur de base de données ou si la validation des données échoue.
 */
const createComment = async (req: Request, res: Response): Promise<void> => {
  const { postId, commentId, userId, content, commentedPostId, commentedCommentId } = req.body;
  const media = res.locals.filePath;

  const errors = validateCommentEntry({ postId, commentId, userId, content, media, commentedPostId, commentedCommentId });
  if (errors.length > 0) {
    apiError(res, "Validation error", errors, 400);
    return;
  }

  const user = await db.User.findByPk(userId);
  if (!user) {
    apiError(res, `The specified user with ID ${userId} does not exist.`, 404);
    return;
  }
  const userName = user.username;

  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    const transaction = await db.sequelize.transaction();
    try {
      let comment;

      if (postId && !commentId) {
        comment = await createCommentOnPost(postId, userId, content, media, userName, transaction);

      } else if (commentId && !postId) {
        comment = await createReplyOnComment(commentId, userId, content, media, userName, commentedPostId, transaction);

      } else {
        console.log("Neither postId nor commentId is properly defined.");
        await transaction.rollback();
        apiError(res, "Validation error", "Invalid request parameters.", 400);
        return;
      }

      if (commentedPostId && postId) {
        await handleRepost(commentedPostId, userId, transaction);
      }

      await transaction.commit();
      apiSuccess(res, "Comment created successfully", comment, 201);
      return;
    } catch (error) {
      await transaction.rollback();

      if (error instanceof DatabaseError && error.parent.message === 'SQLITE_BUSY') {
        if (attempt < maxRetries) {
          console.warn(`SQLITE_BUSY: Attempt ${attempt}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, 100 * attempt)); 
          continue;
        }
      } else if ((error as Error).message.includes("does not exist")) {
        apiError(res, "Validation error", (error as Error).message, 400);
        return;
      }

      return handleControllerError(res, error, "An error occurred while creating the comment.");
    }
  }
};

const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await db.Comment.findAll();
    return apiSuccess(res, "All comments", comments);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting all comments."
    );
  }
};

const getCommentsByPostId = async (req: Request, res: Response) => {
  const { postId } = req.params;
  console.log(postId);
  if (!postId) {
    return apiError(res, "Post ID is required", 400);
  }
  try {
    const comments = await db.Comment.findAll({ 
      where: { postId },
      include: [
        {
          model: db.User,
          as: "commentLikers",
          through: { attributes: [] },
          attributes: ["id", "username"],
        },
        {
          model: db.User,
          as: "commentReposters",
          through: { attributes: [] },
          attributes: ["id"],
        },
      ],
    });
    return apiSuccess(res, `Comments for post ${postId}`, comments);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting the comments."
    );
  }
};

const getCommentsByCommentId = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  if (!commentId) {
    return apiError(res, "Comment ID is required", 400);
  }
  try {
    const comments = await db.Comment.findAll({ where: { commentId } });
    return apiSuccess(res, `Comments for comment ${commentId}`, comments);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting the comments."
    );
  }
};

const getCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return apiError(res, "Comment ID is required", 400);
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      return apiError(res, "Comment not found", 404);
    } else {
      return apiSuccess(res, `Comment ${commentId} found`, comment);
    }
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting the comment."
    );
  }
};

const updateComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return apiError(res, "Comment ID is required", 400);
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      return apiError(res, "Comment not found", 404);
    } else {
      await comment.update(req.body);
      return apiSuccess(res, "Comment updated successfully", comment);
    }
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while updating the comment."
    );
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return apiError(res, "Comment ID is required", 400);
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      return apiError(res, "Comment not found", 404);
    } else {
      await comment.destroy();
      return apiSuccess(res, "Comment deleted successfully");
    }
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while deleting the comment."
    );
  }
};

export {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentsByPostId,
  getCommentsByCommentId,
};
