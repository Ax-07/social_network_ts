import { Dispatch } from "@reduxjs/toolkit/react";
import { ToastType } from "../../../components/toast/Toast";
import { NotificationTypes } from "../../../utils/types/notification.types";
import { io, Socket } from "socket.io-client";
import { addNotification, initNotifications } from "../../../services/notifications/notificationSlice";

/**
 * Initialise la connexion WebSocket et configure la réception des notifications.
 * 
 * @param {string} userId - ID de l'utilisateur courant.
 * @param {(toast: ToastType) => void} pushToast - Fonction pour afficher un toast.
 * @param {Dispatch} dispatch - Fonction de dispatch pour Redux.
 * @param {React.MutableRefObject<Socket | null>} socketRef - Référence du socket WebSocket.
 * 
 * @returns {() => void} - Fonction de nettoyage pour fermer la connexion WebSocket.
 */
export const initSocketNotifications = (
    userId: string,
    pushToast: (toast: ToastType) => void,
    dispatch: Dispatch,
    socketRef: React.MutableRefObject<Socket | null>
  ): () => void => {

    const newSocket = io('http://localhost:8080', {
      path: '/socket.io',
      auth: { token: userId },
    });
  
    // Stocker le socket dans la référence
    socketRef.current = newSocket;
  
    // Écouter les événements 'notification' du serveur
    newSocket.on('notification', (notification: NotificationTypes) => {
        console.log('New notification:', notification);
    
        dispatch(addNotification(notification));
    
        // Afficher un toast pour la notification
        pushToast({
            type: 'notification',
            message: notification.message,
        });
    });
  
    // Fonction de nettoyage lors de la fermeture du socket
    return () => {
      if (newSocket) {
        newSocket.close();
        socketRef.current = null;
      }
    };
  };