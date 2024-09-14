import { io, Socket } from 'socket.io-client';

// Variable pour stocker la connexion WebSocket
let socket: Socket | null = null;

/**
 * Fonction pour établir une connexion WebSocket avec un mécanisme de reconnexion progressive.
 *
 * @param {string} userId - L'identifiant de l'utilisateur.
 * @returns {Socket | null} - Retourne l'instance WebSocket si la connexion est réussie.
 */
export const connectSocket = (userId: string): Socket | null => {
  let attempt = 0; // Nombre de tentatives de connexion
  const maxAttempts = 5; // Limite du nombre de tentatives

  /**
   * Fonction qui tente de créer une connexion WebSocket
   */
  const createSocketConnection = () => {
    if (!socket && attempt < maxAttempts) { // Si aucune connexion n'existe et qu'il reste des tentatives
      attempt++; // Incrémente le compteur de tentatives

      // Crée une nouvelle connexion WebSocket
      socket = io('http://localhost:8080', {
        path: '/socket.io',
        auth: { token: userId }, // Authentification avec l'userId
      });

      // Si la connexion est réussie, on réinitialise les tentatives
      socket.on('connect', () => {
        console.log('WebSocket connected');
        attempt = 0; // Réinitialise le compteur de tentatives
      });

      // Gère les erreurs de connexion (ex: serveur non disponible)
      socket.on('connect_error', () => {
        console.warn(`Tentative de connexion échouée (${attempt}/${maxAttempts}). Nouvel essai...`);
        // Attente exponentielle (backoff) avant de réessayer la connexion
        setTimeout(createSocketConnection, attempt * 1000);
      });

      // Écoute la déconnexion du serveur et réinitialise la connexion
      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        socket = null; // Réinitialise l'objet socket
      });
    }
  };

  // Tente de créer la connexion dès le début
  createSocketConnection();

  return socket; // Retourne l'instance WebSocket
};

/**
 * Fonction pour déconnecter le socket WebSocket.
 * Appelée lorsque le composant se démonte ou que l'utilisateur se déconnecte.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect(); // Déconnecte proprement du serveur WebSocket
    socket = null; // Réinitialise l'objet socket
  }
};
