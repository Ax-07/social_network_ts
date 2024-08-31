import { Transaction } from "sequelize";
import db from "../../../models";
import { io } from "../../../services/notifications";

/**
 * Crée un commentaire sur un commentaire parent, met à jour le nombre de commentaires du commentaire parent,
 * et envoie une notification au propriétaire du commentaire parent.
 * 
 * @param {string} commentId - L'ID du commentaire parent.
 * @param {string} userId - L'ID de l'utilisateur qui crée le commentaire.
 * @param {string} content - Le contenu du commentaire.
 * @param {string} [media] - Le chemin du fichier média associé au commentaire (optionnel).
 * @param {string} [userName] - Le nom d'utilisateur de l'auteur du commentaire (optionnel).
 * @param {string} [commentedPostId] - L'ID du post qui est commenté (dans le cas d'un repost) (optionnel).
 * @param {Transaction} [transaction] - La transaction Sequelize en cours pour garantir l'intégrité de la base de données (optionnel).
 * @returns {Promise<Object>} Le commentaire créé.
 * 
 * @throws {Error} Lance une erreur si la création du commentaire échoue ou si le commentaire parent n'existe pas.
 */
export const createReplyOnComment = async (
    commentId: string,
    userId: string,
    content: string,
    media?: string,
    userName?: string,
    commentedPostId?: string,
    transaction?: Transaction
  ): Promise<object> => {
    const parentComment = await db.Comment.findByPk(commentId, { transaction });
    if (!parentComment) {
      throw new Error("The specified parent comment does not exist");
    }
  
    const comment = await db.Comment.create(
      { commentId, userId, content, media, commentedPostId },
      { transaction }
    );
  
    await parentComment.increment("commentsCount", { by: 1, transaction });
  
    const parentCommentOwner = await db.User.findByPk(parentComment.userId, { transaction });
    if (parentCommentOwner) {
     const response = await db.Notification.create(
            {
                userId: parentCommentOwner.id,
                commenterId: userId,
                type: "comment",
                message: `${userName} a commenté votre commentaire`,
                commentId: parentComment.postId,
            },
            { transaction }
        );
      if (response) {
      io.to(parentComment.userId).emit("notification", {
        id: response.id,
        userId: parentCommentOwner.id,
        commenterId: userId,
        type: "comment",
        message: `${userName} a commenté votre commentaire`,
        commentId: parentComment.postId,
        createdAt: response.createdAt,
      });
    }
  }
  
    return comment;
  };