import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationTypes } from '../../../utils/types/notification.types';
import { useGetAllNotificationsByUserIdQuery } from '../../../services/api/notificationApi';
import { usePushToast } from '../../../components/toast/useToast';
import { initSocketNotifications } from '../functions/initSocketNotifications';
import { initNotifications } from '../../../services/notifications/notificationSlice';
import { RootState } from '../../../services/stores';

/**
 * Hook personnalisé pour gérer les notifications en temps réel via WebSocket.
 * Combine les notifications de l'API et celles du WebSocket.
 * 
 * @param {string} userId - ID de l'utilisateur courant.
 * 
 * @returns {{ notifications: NotificationTypes[], socket: Socket | null }} 
 * - notifications : Liste des notifications en temps réel et celles de l'API.
 * - socket : Instance WebSocket (Socket.io).
 */
const useNotifications = (userId: string): { notifications: NotificationTypes[], socket: Socket | null } => {
  const { data: { data: notificationsFromDatabase } = {} } = useGetAllNotificationsByUserIdQuery(userId); // Récupérer les notifications de la DB
  const notifications = useSelector((state: RootState) => state.notifications.notifications); // Sélecteur pour les notifications
  const pushToast = usePushToast(); // Hook personnalisé pour les toasts
  const dispatch = useDispatch(); // Dispatch pour Redux
  const socketRef = useRef<Socket | null>(null); // Référence au WebSocket

  // Initialisation de la connexion WebSocket
  useEffect(() => {
    if (!userId || socketRef.current) return;

    console.log("useNotifications initializeSocketConnection");

    // Fonction de nettoyage à retourner pour fermer la connexion
    const cleanup = initSocketNotifications(userId, pushToast, dispatch, socketRef);

    return cleanup; // Nettoyage au démontage du composant
  }, [userId, dispatch, pushToast]);

  // Synchronisation des notifications locales avec celles de la base de données
  useEffect(() => {
    console.log("useNotifications notificationsFromDatabase", notificationsFromDatabase);
    if (notificationsFromDatabase) {
      dispatch(initNotifications(notificationsFromDatabase)); // Initialiser les notifications dans le store Redux
    }
  }, [dispatch, notificationsFromDatabase]);

  return { notifications, socket: socketRef.current };
};

export default useNotifications;