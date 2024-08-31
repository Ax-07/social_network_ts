import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePushToast } from '../../../components/toast/Toasts';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../services/notifications/notificationSlice';
import { NotificationTypes } from '../../../utils/types/notification.types';

/**
 * Hook personnalisé pour gérer les notifications en temps réel via WebSocket.
 * 
 * Ce hook établit une connexion WebSocket avec le serveur, écoute les événements de notification,
 * affiche des toasts pour les notifications reçues, et met à jour l'état global avec les nouvelles notifications.
 * 
 * @function useNotifications
 * @param {string} userId - L'ID de l'utilisateur actuel, utilisé pour l'authentification via WebSocket.
 * 
 * @returns {{ notifications: NotificationTypes[], socket: Socket | null }} 
 * Un objet contenant les notifications reçues et la connexion WebSocket actuelle.
 * 
 * @property {NotificationTypes[]} notifications - Un tableau des notifications reçues en temps réel.
 * @property {Socket | null} socket - L'instance du socket WebSocket, ou `null` si non connecté.
 * 
 * @example
 * const { notifications, socket } = useNotifications(userId);
 * 
 * @description
 * - Ce hook crée une connexion WebSocket lorsque le composant est monté, et la ferme lors de son démontage.
 * - Il écoute les événements `notification` envoyés par le serveur, met à jour la liste des notifications dans l'état local,
 *   affiche une notification via le système de toasts, et enregistre la notification dans le store Redux.
 */
const useNotifications = (userId: string): { notifications: NotificationTypes[], socket: Socket | null } => {
  const [notifications, setNotifications] = useState<NotificationTypes[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const pushToast = usePushToast();
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Créer une connexion WebSocket
    const newSocket = io('http://localhost:8080', {
      path: '/socket.io', // Spécifiez le chemin pour les notifications
      auth: {
        token: userId, // Envoyer l'ID de l'utilisateur comme jeton d'authentification
      },
    });

    // Écoute des notifications
    newSocket.on('notification', (notification: NotificationTypes) => {
      setNotifications(prev => [...prev, notification]);

      // Afficher une notification pour chaque notification reçue
      pushToast({
        type: 'notification',
        message: notification.message,
      });

      // Ajouter la notification à la liste des notifications
      dispatch(addNotification({
        id: notification.id,
        userId: userId,
        commenterId: notification.commenterId,
        type: notification.type,
        message: notification.message,
        isRead: false,
        postId: notification.postId,
        commentId: notification.commentId,
        createdAt: notification.createdAt,
      }));
    });

    setSocket(newSocket);

    // Nettoyage lors du démontage du composant
    return () => {
      newSocket.close();
    };
  }, [dispatch, pushToast, userId]);

  return { notifications, socket };
};

export default useNotifications;
