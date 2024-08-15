import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validatePostEntry from '../utils/functions/validatePostEntry';

const createPost = async (req: Request, res: Response) => {
  const { userId, content } = req.body;
  const media = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals
  if (!userId  || !content) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'userId, and content are required',
    });
  }
  const errors = validatePostEntry({ userId, content, media });
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation error', message: errors });
  }
  try {
        // Vérifier que l'utilisateur existe
        const user = await db.User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found', message: `The specified ${userId} user does not exist.` });
        }

    const post = await db.Post.create({ userId, content, media });
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    handleControllerError(res, error, 'An error occurred while creating the post.');
  }
};

const rePost = async (req: Request, res: Response) => {
  const { userId, originalPostId } = req.body; console.log(req.body);

  if (!userId || !originalPostId) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'userId and originalPostId are required',
    });
  }

  const errors = validatePostEntry({ userId, originalPostId });
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation error', message: errors });
  }
  try {
    // Commencer une transaction pour garantir l'intégrité des données
    const transaction = await db.sequelize.transaction();

    try {
      const user = await db.User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ message: 'User not found' });
      }
      const post = await db.Post.findByPk(originalPostId, { transaction });

      if (!post) {
        await transaction.rollback();
        return res.status(404).json({ message: `Post ${originalPostId} not found` });
      }

      // Ajoutez l'utilisateur à la liste des reposters
      const reposters = post.reposters || [];
      if (!reposters.includes(userId)) {
        reposters.push(userId);
        await post.update({ reposters }, { transaction });
      }

      const rePost = await db.Post.create({
        userId,
        content: post.content,
        media: post.media,
        originalPostId: post.id, // Référence au post original
        likers: [],
      }, { transaction });

      await transaction.commit();

      return res.status(201).json({ message: 'Post reposted successfully', rePost, post });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while reposting the post.');
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

export { createPost, rePost, getAllPosts, getPostById, updatePost , deletePost };