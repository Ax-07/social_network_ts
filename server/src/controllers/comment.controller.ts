import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validateCommentEntry from '../utils/functions/validateCommentEntry';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';


const createComment = async (req: Request, res: Response) => {
  const { postId, userId, content, commentedPostId } = req.body;
  const media = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals

  if (!postId || !userId || (!content && !media && !commentedPostId)) {
    return apiError(res, 'Validation error', 'postId, userId, content, media, or commentedPostId is required', 400);
  }

  const errors = validateCommentEntry({ postId, userId, content, media, commentedPostId });
  if (errors.length > 0) {
    return apiError(res, 'Validation error', errors, 400);
  }
  // Commencer une transaction
  const transaction = await db.sequelize.transaction();
  try {
    // Créer le commentaire
    const comment = await db.Comment.create(
      { postId, userId, content, media, commentedPostId },
      { transaction }
    );

    // Mettre à jour le post partagé en ajoutant l'utilisateur aux reposters, s'il y a un commentedPostId
    if (commentedPostId) {
      const commentedPost = await db.Post.findByPk(commentedPostId, { transaction });
      if (!commentedPost) {
        await transaction.rollback();
        return apiError(res, `The specified ${commentedPostId} post does not exist.`, 404);
      }
      const reposters = commentedPost.reposters || [];
      if (!reposters.includes(userId)) {
        reposters.push(userId);
        await commentedPost.update({ reposters }, { transaction });
      }
    }
    // Valider la transaction
    await transaction.commit();

    return apiSuccess(res, 'Comment created successfully', comment, 201);
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await transaction.rollback();
    return handleControllerError(res, error, 'An error occurred while creating the comment.');
  }
};

const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await db.Comment.findAll();
    return apiSuccess(res, 'All comments', comments);
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while getting all comments.');
  }
};

const getCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return apiError(res, 'Comment ID is required', 400);
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      return apiError(res, 'Comment not found', 404);
    } else {
      return apiSuccess(res, `Comment ${commentId} found`, comment);
    }
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while getting the comment.');
  }
};

const updateComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return apiError(res, 'Comment ID is required', 400);
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      return apiError(res, 'Comment not found', 404);
    } else {
      await comment.update(req.body);
      return apiSuccess(res, 'Comment updated successfully', comment);
    }
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while updating the comment.');
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return apiError(res, 'Comment ID is required', 400);
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      return apiError(res, 'Comment not found', 404);
    } else {
      await comment.destroy();
      return apiSuccess(res, 'Comment deleted successfully');
    }
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while deleting the comment.');
  }
};

export { createComment, getAllComments, getCommentById, updateComment, deleteComment };