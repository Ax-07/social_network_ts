import { Transaction } from "sequelize";
import db from "../../../db/models";
import { io } from "../../notifications/services";

export const handleRepost = async (
    commentedPostId: string,
    userId: string,
    transaction: Transaction
  ) => {
    // Vérifiez si le post commenté existe
    const commentedPost = await db.Post.findByPk(commentedPostId, { transaction });
    if (!commentedPost) {
      throw new Error(`The specified post with ID ${commentedPostId} does not exist.`);
    }

    // Vérifiez si l'utilisateur a déjà reposté ce post
    const existingRepost = await db.PostRepost.findOne({
      where: {
        userId: userId,
        postId: commentedPostId,
      },
      transaction,
    });

    // Si l'utilisateur n'a pas déjà reposté, créez une nouvelle entrée dans PostRepost
    if (!existingRepost) {
      await db.PostRepost.create({
        userId: userId,
        postId: commentedPostId,
      }, { transaction });

      // Créez une notification pour le propriétaire du post original
      const response = await db.Notification.create({
        userId: commentedPost.userId,
        senderId: userId,
        type: "repost",
        postId: commentedPost.id,
        message: "Votre publication a été partagée",
      }, { transaction });

      // Émettre la notification via socket.io
      if (response) {
        io.to(commentedPost.userId).emit("notification", {
          id: response.id,
          type: "repost",
          postId: commentedPost.id,
          userId: commentedPost.userId,
          senderId: userId,
          message: "Votre publication a été partagée",
          createdAt: response.createdAt,
        });
      }
    }
  };