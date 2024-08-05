import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validateCommentEntry from '../utils/functions/validateCommentEntry';

const createComment = async (req: Request, res: Response) => {
  const { postId, userId, content } = req.body;
  const picture = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals
  const video = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals
  if (!postId || !userId || !content) {
    return res.status(400).json({ message: 'Missing required information' });
  }
  const errors = validateCommentEntry({ postId, userId, content, picture, video });
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation error', errors });
  }
  try {
    const comment = await db.Comment.create({ postId, userId, content, picture, video });
    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
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