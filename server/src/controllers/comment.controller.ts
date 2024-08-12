import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validateCommentEntry from '../utils/functions/validateCommentEntry';


const createComment = async (req: Request, res: Response) => {
  const { postId, userId, content, commentedPostId } = req.body;
  const media = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals

  if (!postId || !userId || (!content && !media && !commentedPostId)) {
    return res.status(400).json({ message: 'Missing required information' });
  }

  const errors = validateCommentEntry({ postId, userId, content, media, commentedPostId });
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation error', errors });
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
        return res.status(404).json({ message: `Commented post ${commentedPostId} not found` });
      }

      const reposters = commentedPost.reposters || [];
      if (!reposters.includes(userId)) {
        reposters.push(userId);
        await commentedPost.update({ reposters }, { transaction });
      }
    }

    // Valider la transaction
    await transaction.commit();

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await transaction.rollback();
    handleControllerError(res, error, 'An error occurred while creating the comment.');
  }
};

const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await db.Comment.findAll();
    res.status(200).json(comments);
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while getting all comments.');
  }
};

const getCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return res.status(400).json({ message: 'Comment ID is required' });
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json(comment);
    }
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while getting the comment.');
  }
};

const updateComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return res.status(400).json({ message: 'Comment ID is required' });
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      await comment.update(req.body);
      res.status(200).json({ message: 'Comment updated successfully', comment });
    }
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while updating the comment.');
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (!commentId) {
    return res.status(400).json({ message: 'Comment ID is required' });
  }
  try {
    const comment = await db.Comment.findByPk(commentId);
    if (comment === null) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      await comment.destroy();
      res.status(200).json({ message: 'Comment deleted successfully' });
    }
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while deleting the comment.');
  }
};

export { createComment, getAllComments, getCommentById, updateComment, deleteComment };