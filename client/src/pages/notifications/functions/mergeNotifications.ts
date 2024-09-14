import { NotificationTypes } from "../../../utils/types/notification.types";

/**
 * Fonction pour fusionner et trier les notifications tout en évitant les doublons.
 * 
 * @param {NotificationTypes[]} webSocketNotifications - Notifications reçues via WebSocket.
 * @param {NotificationTypes[]} notificationsFromApi - Notifications récupérées via l'API.
 * 
 * @returns {NotificationTypes[]} - Liste fusionnée des notifications sans doublons de la plus récente à la plus ancienne.
 */
export const mergeNotifications = (
  webSocketNotifications: NotificationTypes[], 
  notificationsFromApi: NotificationTypes[]
): NotificationTypes[] => {
  const initializedNotifications = [...notificationsFromApi]; // Priorité aux notifications de l'API

  // Pour chaque notification reçue via WebSocket, vérifier si elle existe déjà dans les notifications de l'API
  webSocketNotifications.forEach(notification => {
    const exists = initializedNotifications.some(n => n.id === notification.id);
    if (!exists) {
      initializedNotifications.push(notification);
    }
  });

  // Trier les notifications par date de création, gérer undefined
  const sortNotifications = initializedNotifications.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;  // Si undefined, on attribue 0 (la plus ancienne)
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;  // Si undefined, on attribue 0 (la plus ancienne)
    
    return dateB - dateA;
  });

  return sortNotifications;
};
