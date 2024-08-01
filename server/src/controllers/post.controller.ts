import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';

const createPost = async (req: Request, res: Response) => {
  const { userId, title, content, picture, video } = req.body;
  console.log(req.body);
  if (!userId || !title || !content) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'userId, title, and content are required',
    });
  }
  console.log(userId, title, content, picture, video);
  try {
    const post = await db.Post.create({ userId: userId, title: title, content: content, picture: picture, video: video });
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
  try {
    const post = await db.Post.findByPk(req.params.id);
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
  try {
    const post = await db.Post.findByPk(req.params.id);
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
  try {
    const post = await db.Post.findByPk(req.params.id);
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