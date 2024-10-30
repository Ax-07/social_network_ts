import { Request, Response } from "express";
import db from "../../../db/models";
import { handleControllerError } from "../../../utils/errors/controllers.error";
import { apiError, apiSuccess } from "../../../utils/functions/apiResponses";
import { io } from "../../notifications/services";
import { sendNotification } from "../../notifications/utils/sendNotification";
import validatePostEntry from "../validations/validatePostEntry";
import { Sequelize } from "sequelize";

const extractHashtags = (text: string) => {
  const regex = /#[\p{L}\p{N}_]+/gu; // Capture les lettres (accentuées ou non), les chiffres et les underscores
  return text.match(regex) || [];
};

const extractMentions = (text: string) => {
  const regex = /@[\p{L}\p{N}_]+/gu; // Permet également les caractères accentués
  return text.match(regex) || [];
};

const createPost = async (req: Request, res: Response) => {
  const {
    userId,
    content,
    question,
    answers,
    expiredAt,
    title,
    description,
    location,
    startDate,
  } = req.body;
  let media = req.body.media; // URL passée dans le body

  // Si l'URL n'est pas passée dans le body, utiliser le fichier uploadé
  if (!media && res.locals.filePath) {
    media = res.locals.filePath; // Utilisez le chemin enregistré dans res.locals par le middleware
  }
  if (!userId || (!content && !question)) {
    return apiError(
      res,
      "Validation error",
      "userId and content or question are required",
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

    // Si le contenu du post contient des hashtags ou des mentions d'utilisateurs
    // Extraire les hashtags et les mentions et les associer au post
    if (content) {
      const hashtagsInText = extractHashtags(content);
      const mentionsInText = extractMentions(content);
      // Créer des hashtags s'ils n'existent pas
      for (const hashtags of hashtagsInText) {
        const [tag] = await db.Hashtag.findOrCreate({
          where: { name: hashtags },
        });
        // Associer le hashtag au post
        await db.PostHashtag.create({
          postId: post.id,
          hashtagId: tag.id,
        });
      }
      // Créer des mentions s'ils n'existent pas
      for (const mention of mentionsInText) {
        const [mentionedUser] = await db.User.findAll({
          where: { username: mention.substring(1) },
        });
        if (mentionedUser) {
          // Associer la mention au post
          await db.Mention.create({
            postId: post.id,
            userId: userId,
            mentionedUserId: mentionedUser.id,
          });
        }
        // Envoyer une notification à l'utilisateur mentionné
        await sendNotification({
          userId: mentionedUser.id,
          senderId: userId,
          type: "mention",
          message: `${user.username} vous a mentionné dans une publication`,
          postId: post.id,
          io,
        });
      }
    }

    // Si la question est incluse dans la requête, la créer
    if (question && answers) {
      const formatedAnswers = answers.map((answer: string) => {
        return { title: answer, votes: 0 };
      });

      await db.Question.create({
        userId: userId,
        postId: post.id,
        question: question,
        answers: formatedAnswers || [],
        expiredAt: expiredAt,
      });
    }

    if (startDate) {
      await db.Evenement.create({
        userId: userId,
        postId: post.id,
        title: title,
        description: description,
        location: location,
        startDate: startDate,
      });
    }

    let newPost;
    if (question && answers) {
      newPost = await db.Post.findByPk(post.id, {
        include: [
          {
            model: db.Question,
            as: "question",
            attributes: ["id", "question", "answers", "postId", "expiredAt"],
          },
        ],
      });
    } else
    if (startDate) {
      newPost = await db.Post.findByPk(post.id, {
        include: [
          {
            model: db.Evenement,
            as: "evenement",
            attributes: ["id", "title", "description", "location", "startDate", "postId"],
          },
        ],
      });
    } else {
      newPost = await db.Post.findByPk(post.id);
    }

    return apiSuccess(res, "Post created successfully", newPost, 201);
  } catch (error) {
    console.error(error);
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
      if (
        originalCommentId !== "" &&
        originalCommentId !== null &&
        originalCommentId !== undefined
      ) {
        comment = await db.Comment.findByPk(originalCommentId, { transaction });
        if (!comment) {
          await transaction.rollback();
          return apiError(
            res,
            `The specified comment with ID ${originalCommentId} does not exist.`,
            404
          );
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
        {
          model: db.Question,
          as: "question",
          attributes: ["id", "question", "answers", "postId", "expiredAt"],
        },
        {
          model: db.Evenement,
          as: "evenement",
          attributes: ["id", "title", "description", "location", "startDate", "postId"],
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

const getPostBySubscription = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) {
    return apiError(res, "User ID is required", 400);
  }
  try {
    const subcribers = await db.UserFollowers.findAll({
      where: {
        followerId: userId,
      },
    });

    const postsListOfSubscibers = await db.Post.findAll({
      where: {
        userId: subcribers.map((sub) => sub.followedId),
      },
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
        {
          model: db.Question,
          as: "question",
          attributes: ["id", "question", "answers", "postId", "expiredAt"],
        },
      ],
    });

    return apiSuccess(res, `Posts by subcribers`, postsListOfSubscibers, 200);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting posts by subscription."
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
        {
          model: db.Question,
          as: "question",
          attributes: ["id", "question", "answers", "postId", "expiredAt"],
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

const getPostsByHashtag = async (req: Request, res: Response) => {
  const hashtag = req.params.hashtag;
  if (!hashtag) {
    return apiError(res, "Hashtag is required", 400);
  }
  try {
    const hashtagId = await db.Hashtag.findOne({
      where: { name: `#${hashtag}` },
      attributes: ["id"],
    }).then((hashtag) => hashtag?.id);

    if (!hashtagId) {
      return apiError(res, `Hashtag ${hashtag} not found`, 404);
    }

    const postsIds = await db.PostHashtag.findAll({
      where: { hashtagId: hashtagId },
      attributes: ["postId"],
    });
    console.log("posts ids", hashtag);
    console.table(postsIds);

    const posts = await db.Post.findAll({
      where: {
        id: postsIds.map((post) => post.postId),
      },
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
    return apiSuccess(res, `Posts with hashtag ${hashtag}`, posts, 200);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting posts by hashtag."
    );
  }
};

const getTrendsHashtags = async (req: Request, res: Response) => {
  const limit = 5;
  try {
    const topHashtags = await db.PostHashtag.findAll({
      attributes: [
        "hashtagId",
        [Sequelize.fn("COUNT", Sequelize.col("postId")), "count"],
      ],
      group: ["hashtagId"],
      order: [[Sequelize.literal("count"), "DESC"]],
      limit: limit,
      include: [
        {
          model: db.Hashtag,
          as: "hashtag",
          attributes: ["name"],
        },
      ],
    });

    const topMentions = await db.Mention.findAll({
      attributes: [
        "mentionedUserId",
        [Sequelize.fn("COUNT", Sequelize.col("postId")), "count"],
      ],
      group: ["mentionedUserId"],
      order: [[Sequelize.literal("count"), "DESC"]],
      limit: limit,
      include: [
        {
          model: db.User,
          as: "mentionedUser",
          attributes: ["id", "username"],
        },
      ],
    });

    console.table(topHashtags);
    return apiSuccess(
      res,
      "Top hashtags",
      { topHashtags: topHashtags, topMentions: topMentions },
      200
    );
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting top hashtags."
    );
  }
};

const getPostsByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) {
    return apiError(res, "User ID is required", 400);
  }
  try {
    const posts = await db.Post.findAll({
      where: { userId: userId },
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
        {
          model: db.Question,
          as: "question",
          attributes: ["id", "question", "answers", "postId", "expiredAt"],
        },
      ],
    });
    return apiSuccess(res, `Posts by user ${userId}`, posts, 200);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "An error occurred while getting posts by user."
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
  getPostBySubscription,
  getPostById,
  getPostsByHashtag,
  getTrendsHashtags,
  getPostsByUserId,
  updatePost,
  deletePost,
  viewPost,
};
