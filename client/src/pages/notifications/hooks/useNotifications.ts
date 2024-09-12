import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../services/notifications/notificationSlice';
import { NotificationTypes } from '../../../utils/types/notification.types';
import { useGetAllNotificationsByUserIdQuery } from '../../../services/api/notificationApi';
import { Dispatch } from '@reduxjs/toolkit/react';
import { ToastType } from '../../../components/toast/Toast';
import { usePushToast } from '../../../components/toast/useToast';

/**
 * Hook personnalisé pour gérer les notifications en temps réel via WebSocket.
 * 
 * Ce hook établit une connexion WebSocket avec le serveur, écoute les événements de notification,
 * affiche des toasts pour les notifications reçues, et met à jour l'état global avec les nouvelles notifications.
 * 
 * @function useNotifications
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
  const { data: { data: notificationsFromDatabase } = {} } = useGetAllNotificationsByUserIdQuery(userId);
  const pushToast = usePushToast();
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  // Initialiser la connexion socket
  useEffect(() => {
    if (!userId || socketRef.current) return;

    const cleanup = initializeSocketConnection(userId, setNotifications, pushToast, dispatch, socketRef);

    return cleanup;
  }, [userId, dispatch, pushToast]);

  // Mettre à jour les notifications avec celles de la base de données
  useEffect(() => {
    if (notificationsFromDatabase) {
      setNotifications(notificationsFromDatabase);
    }
  }, [notificationsFromDatabase]);

  return { notifications, socket: socketRef.current };
};

export default useNotifications;

const handleNewNotification = (
  notification: NotificationTypes,
  setNotifications: React.Dispatch<React.SetStateAction<NotificationTypes[]>>,
  pushToast: (toast: ToastType) => void,
  dispatch: Dispatch,
  userId: string
) => {
  setNotifications(prev => {
    if (!prev.some(n => n.id === notification.id)) {
      return [...prev, notification];
    }
    return prev;
  });

  // Afficher la notification via toast
  pushToast({
    type: 'notification',
    message: notification.message,
  });

  // Ajouter la notification dans Redux
  dispatch(addNotification({
    id: notification.id,
    userId: userId,
    senderId: notification.senderId,
    type: notification.type,
    message: notification.message,
    isRead: false,
    postId: notification.postId,
    commentId: notification.commentId,
    createdAt: notification.createdAt,
  }));
};

const initializeSocketConnection = (
  userId: string,
  setNotifications: React.Dispatch<React.SetStateAction<NotificationTypes[]>>,
  pushToast: (toast: ToastType) => void,
  dispatch: Dispatch,
  socketRef: React.MutableRefObject<Socket | null>
) => {
  const newSocket = io('http://localhost:8080', {
    path: '/socket.io',
    auth: { token: userId },
  });

  socketRef.current = newSocket;

  // Écoute des événements de notification
  newSocket.on('notification', (notification: NotificationTypes) => {
    handleNewNotification(notification, setNotifications, pushToast, dispatch, userId);
  });

  return () => {
    if (newSocket) {
      newSocket.close();
      socketRef.current = null;
    }
  };
};
