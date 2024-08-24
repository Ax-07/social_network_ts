import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";
import validateCommentEntry from "../utils/functions/validateCommentEntry";
import { apiError, apiSuccess } from "../utils/functions/apiResponses";

const createComment = async (req: Request, res: Response) => {
  const postId = req.body.postId;
  const commentId = req.body.commentId;
  console.log("postId", postId, "commentId", commentId);

  const { userId, content, commentedPostId, commentedCommentId } = req.body;
  const media = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals

  const errors = validateCommentEntry({postId, commentId, userId, content, media, commentedPostId, commentedCommentId});
  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }

  // Commencer une transaction
  const transaction = await db.sequelize.transaction();
  try {
    let comment;

    if (postId && !commentId) {
      console.log("postId is defined");
      comment = await db.Comment.create(
        { postId, userId, content, media, commentedPostId, commentedCommentId },
        { transaction }
      );
      // Incrémenter le nombre de commentaires du post
      const post = await db.Post.findByPk(postId, { transaction });
      if (post) {
        await post.increment("commentsCount", { by: 1, transaction });
      }
    } else if (commentId && !postId) {
      // Vérifiez d'abord que le commentaire parent existe
      const parentComment = await db.Comment.findByPk(commentId);
      if (!parentComment) {
        await transaction.rollback();
        return apiError( res, "Validation error", "The specified parent comment does not exist", 400 );
      }

      comment = await db.Comment.create(
        { commentId, userId, content, media, commentedPostId },
        { transaction }
      );
      // Incrémenter le nombre de commentaires du commentaire parent
      await parentComment.increment("commentsCount", { by: 1, transaction });
      console.log("Comment created with commentId:", comment);
    } else {
      console.log("Neither postId nor commentId is properly defined.");
    }

    // Mettre à jour le post partagé en ajoutant l'utilisateur aux reposters, s'il y a un commentedPostId
    if (commentedPostId && postId) {
      const commentedPost = await db.Post.findByPk(commentedPostId, {
        transaction,
      });
      if (!commentedPost) {
        await transaction.rollback();
        return apiError( res, `The specified ${commentedPostId} post does not exist.`, 404 );
      }
      const reposters = commentedPost.reposters || [];
      if (!reposters.includes(userId)) {
        reposters.push(userId);
        await commentedPost.update({ reposters }, { transaction });
      }
    }
    // Valider la transaction
    await transaction.commit();

    return apiSuccess(res, "Comment created successfully", comment, 201);
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await transaction.rollback();
    return handleControllerError( res, error, "An error occurred while creating the comment." );
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
    const comments = await db.Comment.findAll({ where: { postId } });
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
