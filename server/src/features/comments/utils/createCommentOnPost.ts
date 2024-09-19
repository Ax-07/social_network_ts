import { Transaction } from "sequelize";
import db from "../../../db/models";
import { io } from "../../notifications/services";
import { sendNotification } from "../../notifications/utils/sendNotification";

/**
 * Crée un commentaire sur un post, met à jour le nombre de commentaires du post,
 * et envoie une notification au propriétaire du post.
 *
 * @param {string} postId - L'ID du post sur lequel le commentaire est ajouté.
 * @param {string} userId - L'ID de l'utilisateur qui crée le commentaire.
 * @param {string} content - Le contenu du commentaire.
 * @param {string} [media] - Le chemin du fichier média associé au commentaire (optionnel).
 * @param {string} [userName] - Le nom d'utilisateur de l'auteur du commentaire (optionnel).
 * @param {Transaction} [transaction] - La transaction Sequelize en cours pour garantir l'intégrité de la base de données (optionnel).
 * @returns {Promise<object>} Le commentaire créé.
 *
 * @throws {Error} Lance une erreur si la création du commentaire échoue ou si le post associé n'existe pas.
 */
export const createCommentOnPost = async (
  postId: string,
  userId: string,
  content: string,
  media?: string,
  userName?: string,
  transaction?: Transaction
): Promise<object> => {
  const comment = await db.Comment.create(
    { postId, userId, content, media },
    { transaction }
  );

  const post = await db.Post.findByPk(postId, { transaction });
  if (!post) {
    throw new Error("The specified post does not exist");
  }

  await post.increment("commentsCount", { by: 1, transaction });

  const postOwner = await db.User.findByPk(post.userId, { transaction });
  if (postOwner) {
    await sendNotification({
      userId: post.userId,
      senderId: userId,
      type: "comment",
      message: `${userName} a commenté votre post`,
      postId,
      io,
      transaction,
    });
  }

  return comment;
};
