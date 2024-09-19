import db from "../../../db/models";
import { Server as SocketIOServer } from "socket.io"; // Typage pour Socket.IO
import { Transaction } from "sequelize"; // Typage pour Sequelize Transaction

// Interface pour les paramètres de notification
interface SendNotificationParams {
  userId: string;             // ID de l'utilisateur recevant la notification
  senderId: string;           // ID de l'utilisateur envoyant la notification
  type: string;               // Type de la notification (repost, comment, etc.)
  message: string;            // Message personnalisé
  postId?: string;            // ID du post (peut être string ou undefined)
  commentId?: string;         // ID du commentaire (peut être string ou undefined)
  io: SocketIOServer;         // Typage correct pour l'instance Socket.io
  transaction?: Transaction;  // Typage pour Sequelize transaction
}

export const sendNotification = async ({
  userId,
  senderId,
  type,
  message,
  postId,       // Pas besoin de valeur par défaut, undefined est implicite
  commentId,    // Pas besoin de valeur par défaut, undefined est implicite
  io,
  transaction,
}: SendNotificationParams) => {
  try {
    // Créer une notification dans la base de données
    const notification = await db.Notification.create(
      {
        userId,
        senderId,
        type,
        message,
        postId,
        commentId,
      },
      { transaction }
    );

    // Envoyer la notification via Socket.io
    if (notification) {
      io.to(userId).emit("notification", {
        id: notification.id,
        type,
        postId,
        commentId,
        userId,
        senderId,
        message,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
};
