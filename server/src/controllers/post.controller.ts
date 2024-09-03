import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validatePostEntry from '../utils/functions/validations/validatePostEntry';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';
import { io } from '../services/notifications';


const createPost = async (req: Request, res: Response) => {
  const { userId, content } = req.body;
  let media = req.body.media; // URL passée dans le body

  // Si l'URL n'est pas passée dans le body, utiliser le fichier uploadé
  if (!media && res.locals.filePath) {
    media = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals par le middleware
  }
  if (!userId  || !content) {
    return apiError(res, 'Validation error', 'userId and content are required', 400);
  }
  const errors = validatePostEntry({ userId, content, media });
    if (errors.length > 0) {
      return apiError(res, 'Validation error', errors, 400);
    }
    try {
      // Vérifier que l'utilisateur existe
      const user = await db.User.findByPk(userId);
      if (!user) {
        return apiError(res, `The specified ${userId} user does not exist.`, 404);
      }
    const post = await db.Post.create({ userId: userId, content: content, media: media });
    return apiSuccess(res, 'Post created successfully', post, 201);
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while creating the post.');
  }
};

const rePost = async (req: Request, res: Response) => {
  const { userId, originalPostId, content } = req.body;

  if (!userId || !originalPostId) {
    return apiError(res, 'Validation error', 'userId and originalPostId are required', 400);
  }

  const errors = validatePostEntry({ userId, originalPostId, content });
  if (errors.length > 0) {
    return apiError(res, 'Validation error', errors, 400);
  }

  try {
    // Commencer une transaction pour garantir l'intégrité des données
    const transaction = await db.sequelize.transaction();

    try {
      const user = await db.User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return apiError(res, `The specified ${userId} user does not exist.`, 404);
      }
      
      const post = await db.Post.findByPk(originalPostId, { transaction });
      if (!post) {
        await transaction.rollback();
        return apiError(res, `The specified ${originalPostId} post does not exist.`, 404);
      }

      // Vérifier si l'utilisateur a déjà reposté ce post
      const existingRepost = await db.PostRepost.findOne({
        where: {
          userId: userId,
          postId: originalPostId,
        },
        transaction,
      });

      if (existingRepost) {
        await transaction.rollback();
        return apiError(res, 'You have already reposted this post.', 400);
      }

      // Créer un nouveau repost
      const newRepost = await db.Post.create({
        userId,
        originalPostId: post.id,
        content: content || null,
      }, { transaction });

      // Ajouter une entrée dans la table PostRepost
      await db.PostRepost.create({
        userId: userId,
        postId: post.id,
      }, { transaction });

      // Envoyer une notification (exemple avec socket.io)
      io.to(post.userId).emit('notification', {
        id: newRepost.id,
        type: 'repost',
        postId: post.id,
        userId: post.userId,
        senderId: userId,
        message: 'Votre publication a été partagée',
        createdAt: newRepost.createdAt
      });

      await transaction.commit();
      return apiSuccess(res, 'Post reposted successfully', newRepost, 201);
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
    return apiSuccess(res, 'All posts', posts, 200);
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while getting all posts.');
  }
};

const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return apiError(res, 'Post ID is required', 400);
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      return apiError(res, 'Post not found from getPostById', 404);
    } else {
      return apiSuccess(res, `Post ${postId} found`, post, 200);
    }
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while getting the post.');
  }
};

const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return apiError(res, 'Post ID is required', 400);
  }
  const errors = validatePostEntry(req.body);
  if (errors.length > 0) {
    return apiError(res, 'Validation error', errors, 400);
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      return apiError(res, 'Post not found', 404);
    } else {
      await post.update(req.body);
      return apiSuccess(res, `Post ${postId} updated successfully`, post, 200);
    }
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while updating the post.');
  }
};

/**
 * 
 * @description Supprime un post
 * @returns l'id du post supprimé 
 */
const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return apiError(res, 'Post ID is required', 400);
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      return apiError(res, 'Post not found', 404);
    } else {
      await post.destroy();
      return apiSuccess(res, `Post ${postId} deleted successfully`, { id: postId }, 200);
    }
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while deleting the post.');
  }
};

/**
 * 
 * @description Incremente le nombre de vues d'un post
 * @returns le post avec le nombre de vues incrémenté
 */
const viewPost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return apiError(res, 'Post ID is required', 400);
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      return apiError(res, 'Post not found', 404);
    } else {
      post.views += 1;
      await post.save();
      return apiSuccess(res, `Post ${postId} viewed successfully`, post, 200);
    }
  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while viewing the post.');
  }
};

export { 
  createPost,
  rePost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  viewPost,
};