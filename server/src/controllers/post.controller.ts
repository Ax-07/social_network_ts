import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validatePostEntry from '../utils/functions/validatePostEntry';

const createPost = async (req: Request, res: Response) => {
  const { userId, title, content } = req.body;
  const picture = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals
  const video = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals
  if (!userId || !title || !content) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'userId, title, and content are required',
    });
  }
  const errors = validatePostEntry({ userId, title, content, picture, video });
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation error', message: errors });
  }
  try {
    const post = await db.Post.create({ userId, title, content, picture, video });
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while creating the post.');
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await db.Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while getting all posts.');
  }
};

const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required' });
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while getting the post.');
  }
};

const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required' });
  }
  const errors = validatePostEntry(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation error', message: errors });
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      await post.update(req.body);
      res.status(200).json({ message: 'Post updated successfully', post });
    }
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while updating the post.');
  }
};

const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required' });
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      await post.destroy();
      res.status(200).json({ message: 'Post deleted successfully' });
    }
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while deleting the post.');
  }
};

export { createPost, getAllPosts, getPostById, updatePost , deletePost };