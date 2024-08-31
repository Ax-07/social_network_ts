import { Transaction } from "sequelize";
import db from "../../../models";

/**
 * 
 * @param {string} commentedPostId - L'ID du post commenté.
 * @param {string} userId - L'ID de l'utilisateur qui crée le repost.
 * @param {Transaction} transaction - La transaction Sequelize en cours pour garantir l'intégrité de la base de données.
 * 
 * @throws {Error} Lance une erreur si le post commenté n'existe pas.
 */
export const handleRepost = async (
    commentedPostId: string,
    userId: string,
    transaction: Transaction
  ) => {
    const commentedPost = await db.Post.findByPk(commentedPostId, { transaction });
    if (!commentedPost) {
      throw new Error(`The specified post with ID ${commentedPostId} does not exist.`);
    }
  
    const reposters = commentedPost.reposters || [];
    if (!reposters.includes(userId)) {
      reposters.push(userId);
      await commentedPost.update({ reposters }, { transaction });
    }
  };