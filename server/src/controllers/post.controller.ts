import { Request, Response } from "express";
import db from "../models";
import { handleControllerError } from "../utils/errors/controllers.error";
import validatePostEntry from "../utils/functions/validations/validatePostEntry";
import { apiError, apiSuccess } from "../utils/functions/apiResponses";
import { io } from "../services/notifications";
import { sendNotification } from "../utils/functions/notificationsUtils/sendNotification";

const createPost = async (req: Request, res: Response) => {
  const { userId, content } = req.body;
  let media = req.body.media; // URL passée dans le body

  // Si l'URL n'est pas passée dans le body, utiliser le fichier uploadé
  if (!media && res.locals.filePath) {
    media = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals par le middleware
  }
  if (!userId || !content) {
    return apiError(
      res,
      "Validation error",
      "userId and content are required",
      400
    );
  }
  const errors = validatePostEntry({ userId, content, media });
  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }
  try {
    // Vérifier que l'utilisateur existe
    const user = await db.User.findByPk(userId);
    if (!user) {
      return apiError(res, `The specified ${userId} user does not exist.`, 404);
    }
    const post = await db.Post.create({
      userId: userId,
      content: content,
      media: media,
    });
    return apiSuccess(res, "Post created successfully", post, 201);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while creating the post."
    );
  }
};

const rePost = async (req: Request, res: Response) => {
  const { userId, originalPostId, originalCommentId, content } = req.body;
  if (!userId || !originalPostId) {
    return apiError(
      res,
      "Validation error",
      "userId and originalPostId are required",
      400
    );
  }

  const errors = validatePostEntry({
    userId,
    originalPostId,
    originalCommentId,
    content,
  });
  if (errors.length > 0) {
    console.log("errors", errors);
    return apiError(res, "Validation error", errors, 400);
  }

  try {
    // Commencer une transaction pour garantir l'intégrité des données
    const transaction = await db.sequelize.transaction();

    try {
      const user = await db.User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return apiError(
          res,
          `The specified ${userId} user does not exist.`,
          404
        );
      }

      const post = await db.Post.findByPk(originalPostId, { transaction });
      if (!post) {
        await transaction.rollback();
        return apiError(
          res,
          `The specified ${originalPostId} post does not exist.`,
          404
        );
      }

      // Vérifier l'existence de l'originalCommentId seulement s'il est défini
      let comment;
      if (originalCommentId !== "" && originalCommentId !== null && originalCommentId !== undefined) {
        console.log("originalCommentId", originalCommentId);
        comment = await db.Comment.findByPk(originalCommentId, { transaction });
        if (!comment) {
          await transaction.rollback();
          return apiError(res, `The specified comment with ID ${originalCommentId} does not exist.`, 404);
        }
      }

      // // Vérifier si l'utilisateur a déjà reposté ce post
      // const existingRepost = await db.PostRepost.findOne({
      //   where: {
      //     userId: userId,
      //     postId: originalPostId,
      //   },
      //   transaction,
      // });
      //
      // if (existingRepost) {
      //   await transaction.rollback();
      //   return apiError(res, 'You have already reposted this post.', 400);
      // }

      // Créer un nouveau repost
      const newRepost = await db.Post.create(
        {
          userId,
          originalPostId: post.id,
          originalCommentId: originalCommentId || null,
          content: content || null,
        },
        { transaction }
      );

      // Ajouter une entrée dans la table PostRepost
      if (originalPostId && !originalCommentId) {
        await db.PostRepost.create(
          {
            userId: userId,
            postId: post.id,
          },
          { transaction }
        );
        await sendNotification({
          userId: post.userId,
          senderId: userId,
          type: "repost",
          message: `${user.username} a partagé votre publication`,
          postId: post.id,
          io,
          transaction,
        });
      }

      // Ajouter une entrée dans la table commentRepost si originalCommentId est défini
      if (originalCommentId) {
        console.log("create comment repost");
        await db.CommentRepost.create(
          {
            userId: userId,
            originalPostId: post.id,
            commentId: originalCommentId,
          },
          { transaction }
        );
        await sendNotification({
          userId: comment?.userId || "",
          senderId: userId,
          type: "repost",
          message: `${user.username} a partagé votre commentaire`,
          postId: post.id,
          commentId: originalCommentId,
          io,
          transaction,
        });
      }

      // Envoyer une notification (exemple avec socket.io)
      io.to(post.userId).emit("notification", {
        id: newRepost.id,
        type: "repost",
        postId: post.id,
        userId: post.userId,
        senderId: userId,
        message: "Votre publication a été partagée",
        createdAt: newRepost.createdAt,
      });

      await transaction.commit();
      return apiSuccess(res, "Post reposted successfully", newRepost, 201);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.log("error", error);
    return handleControllerError(
      res,
      error,
      "An error occurred while reposting the post."
    );
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await db.Post.findAll({
      include: [
        {
          model: db.User,
          as: "likers",
          through: { attributes: [] }, // Ignorer les attributs de la table de jonction
          attributes: ["id", "username"],
        },
        {
          model: db.User,
          as: "reposters",
          through: { attributes: [] },
          attributes: ["id"],
        },
      ],
    });
    return apiSuccess(res, "All posts", posts, 200);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting all posts."
    );
  }
};

const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return apiError(res, "Post ID is required", 400);
  }
  try {
    const post = await db.Post.findByPk(postId, {
      include: [
        {
          model: db.User,
          as: "likers",
          through: { attributes: [] },
          attributes: ["id", "username"],
        },
        {
          model: db.User,
          as: "reposters",
          through: { attributes: [] },
          attributes: ["id", "username"],
        },
      ],
    });
    if (post === null) {
      return apiError(res, "Post not found from getPostById", 404);
    } else {
      return apiSuccess(res, `Post ${postId} found`, post, 200);
    }
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting the post."
    );
  }
};

const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  if (!postId) {
    return apiError(res, "Post ID is required", 400);
  }
  const errors = validatePostEntry(req.body);
  if (errors.length > 0) {
    return apiError(res, "Validation error", errors, 400);
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      return apiError(res, "Post not found", 404);
    } else {
      await post.update(req.body);
      return apiSuccess(res, `Post ${postId} updated successfully`, post, 200);
    }
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while updating the post."
    );
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
    return apiError(res, "Post ID is required", 400);
  }
  try {
    const post = await db.Post.findByPk(postId);
    if (post === null) {
      return apiError(res, "Post not found", 404);
    } else {
      await post.destroy();
      return apiSuccess(
        res,
        `Post ${postId} deleted successfully`,
        { id: postId },
        200
      );
    }
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while deleting the post."
    );
  }
};

/**
 *
 * @description Incremente le nombre de vues d'un post
 * @returns le post avec le nombre de vues incrémenté
 */
const viewPost = async (req: Request, res: Response) => {
  const { postViewCounts } = req.body; // Un tableau d'objets { postId, count }
  console.log("postViewCounts", postViewCounts);

  if (!Array.isArray(postViewCounts) || postViewCounts.length === 0) {
    return apiError(res, "Post IDs and counts are required", 400);
  }

  try {
    // Utiliser Promise.all pour traiter tous les posts en parallèle
    const posts = await Promise.all(
      postViewCounts.map(async ({ postId, count }) => {
        const post = await db.Post.findByPk(postId);

        if (!post) {
          return null; // Continuer si le post n'existe pas
        }

        // Incrémenter les vues en fonction du compteur
        post.views += count;
        await post.save();

        return post; // Retourner le post mis à jour
      })
    );

    // Filtrer les posts mis à jour
    const updatedPosts = posts.filter((post) => post !== null);

    if (updatedPosts.length === 0) {
      return apiError(res, "No valid posts found", 404);
    }

    return apiSuccess(res, "Posts viewed successfully", updatedPosts, 200);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while viewing the posts."
    );
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
