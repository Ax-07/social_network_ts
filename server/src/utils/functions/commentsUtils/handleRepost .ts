import { Transaction } from "sequelize";
import db from "../../../models";
import { io } from "../../../services/notifications";

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

      const response = await db.Notification.create({
        userId: commentedPost.userId,
        senderId: userId,
        type: "repost",
        postId: commentedPost.id,
        message: "Votre publication a été partagée",
      }, { transaction});

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