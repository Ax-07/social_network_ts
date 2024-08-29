import { Request, Response } from 'express';
import db from '../models';
import { handleControllerError } from '../utils/errors/controllers.error';
import validatePostEntry from '../utils/functions/validatePostEntry';
import { apiError, apiSuccess } from '../utils/functions/apiResponses';


const createPost = async (req: Request, res: Response) => {
  const { userId, content } = req.body; console.log(req.body);
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
  const { userId, originalPostId, content } = req.body; console.log(req.body);

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

      // Ajoutez l'utilisateur à la liste des reposters
      const reposters = post.reposters ? [...post.reposters] : [];
      if (!reposters.includes(userId)) {
        reposters.push(userId); console.log('reposters', reposters);
        await post.update({ reposters: reposters }, { transaction });
      }

      const rePost = await db.Post.create({
        userId,
        originalPostId: post.id, // Référence au post original
        content: content
      }, { transaction });

      await transaction.commit();

      return apiSuccess(res, 'Post reposted successfully', rePost, 201);
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
}

const getBookmarkedPosts = async (req: Request, res: Response) => {
  const userId = req.query.id as string;
  if (!userId) {
    return apiError(res, 'User ID is required', 400);
  }

  try {
    const user = await db.User.findByPk(userId);
    if (user === null) {
      return apiError(res, 'User not found', 404);
    }

    const bookmarkedPostsIds = user.bookmarks;

    // If the user has no bookmarks, return an empty array
    if (!Array.isArray(bookmarkedPostsIds) || bookmarkedPostsIds.length === 0) {
      return apiSuccess(res, `No bookmarked posts found for user ${userId}`, [], 200);
    }

    const bookmarkedPosts = await db.Post.findAll({ where: { id: bookmarkedPostsIds } });

    return apiSuccess(res, `Bookmarked posts for user ${userId}`, bookmarkedPosts, 200);

  } catch (error) {
    return handleControllerError(res, error, 'An error occurred while getting bookmarked posts.');
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
  getBookmarkedPosts
};