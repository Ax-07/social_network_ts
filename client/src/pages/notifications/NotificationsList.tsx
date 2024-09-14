import { useEffect, type FunctionComponent } from 'react';
import { NotificationTypes } from '../../utils/types/notification.types';
import NotificationCard from './NotificationCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import { useUpdateNotificationsMutation } from '../../services/api/notificationApi';
import { updateNotificationStatus } from '../../services/notifications/notificationSlice';

interface NotificationsListProps{
    notifications: NotificationTypes[];
}

const NotificationsList: FunctionComponent<NotificationsListProps> = ({notifications}) => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const dispatch = useDispatch();
  const [updateNotifications] = useUpdateNotificationsMutation();

  const markNotificationsAsRead = () => {
    if (userId) {
      // Récupérer les notifications non lues
      const unreadNotifications = notifications.filter((notif) => !notif.isRead);
      const unreadNotificationIds = unreadNotifications.map((notif) => notif.id);
  
      if (unreadNotificationIds.length > 0) {
        // Mettre à jour les notifications non lues dans la base de données
        updateNotifications({ userId, notificationsIds: unreadNotificationIds.join(',') });
        
        // Mettre à jour les notifications non lues dans le store Redux
        dispatch(updateNotificationStatus({ ids: unreadNotificationIds, isRead: true }));
      }
    }
  };
  
  useEffect(() => {
    markNotificationsAsRead();
  }, [notifications]);
  
  return (
    <div>
      <ul className='notification-page__list'>
        {notifications.map((notif, index) => (
          <li key={index} className='notification-page__item'>
            <NotificationCard {...notif} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsList;