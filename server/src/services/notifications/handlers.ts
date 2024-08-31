import { Server, Socket } from 'socket.io';

/**
 * Enregistre les gestionnaires d'événements de notification pour un socket particulier.
 * 
 * Cette fonction configure le socket pour écouter les événements de commentaire et 
 * envoie une notification au propriétaire du post lorsque quelqu'un commente son post.
 *
 * @function registerNotificationHandlers
 * @param {Server} io - L'instance du serveur Socket.io utilisée pour gérer les connexions.
 * @param {Socket} socket - L'instance du socket représentant la connexion actuelle du client.
 * 
 * @listens Socket#comment
 * 
 * @example
 * // Dans le fichier principal du serveur où le socket.io est initialisé :
 * io.on('connection', (socket) => {
 *   registerNotificationHandlers(io, socket);
 * });
 *
 * @description
 * - Lorsqu'un événement 'comment' est reçu, cette fonction extrait les informations pertinentes 
 *   du `data` envoyé par le client.
 * - Ensuite, elle émet un événement 'notification' à l'utilisateur propriétaire du post (`postOwnerId`),
 *   lui signalant qu'un commentaire a été ajouté à son post.
 * 
 * @param {Object} data - L'objet de données envoyé avec l'événement 'comment'.
 * @param {string} data.postId - L'ID du post qui a été commenté.
 * @param {string} data.commenterName - Le nom de l'utilisateur qui a fait le commentaire.
 * @param {string} data.postOwnerId - L'ID de l'utilisateur propriétaire du post.
 * @param {string} data.userId - L'ID de l'utilisateur qui a fait le commentaire.
 */
export const registerNotificationHandlers = (io: Server, socket: Socket) => {
  socket.on('comment', (data) => {
    const { postId, commenterName, postOwnerId, userId } = data;

    // Envoyer une notification au propriétaire du post
    io.to(postOwnerId).emit('notification', {
      userId: userId,
      message: `${commenterName} a commenté votre post.`,
      postId,
    });
  });

  // Vous pouvez ajouter d'autres événements ici
};
