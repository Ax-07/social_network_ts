import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import { useGetAllNotificationsByUserIdQuery, useUpdateNotificationsMutation } from '../../services/api/notificationApi';
import { NotificationTypes } from '../../utils/types/notification.types';
import TabList from '../../components/Base/tabList/TabList';
import { Routes, Route } from 'react-router-dom';
import NotificationsList from './NotificationsList';
import { updateNotificationStatus } from '../../services/notifications/notificationSlice';
import { Dispatch } from '@reduxjs/toolkit';

const Notifications: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const notificationsFromStore = useSelector((state: RootState) => state.notifications.notifications);
  const { data: { data: notificationFromApi } = {} } = useGetAllNotificationsByUserIdQuery(userId as string, { skip: !userId });
  const [updateNotifications] = useUpdateNotificationsMutation();
  const [uniqueNotifications, setUniqueNotifications] = useState<NotificationTypes[]>([]);
  const dispatch = useDispatch();

  // Fusion des notifications
  useEffect(() => {
    if (notificationFromApi) {
      const mergedNotifications = mergeNotifications(notificationFromApi, notificationsFromStore);
      setUniqueNotifications(mergedNotifications);
    }
  }, [notificationFromApi, notificationsFromStore]);

  // Gestion des notifications non lues
  useEffect(() => {
    if (userId) {
      handleUnreadNotifications(uniqueNotifications, userId, updateNotifications, dispatch);
    }
  }, [uniqueNotifications, updateNotifications, dispatch, userId]);

  return (
    <div className='notification-page'>
      <h2 className='notification-page__title'>Notifications</h2>
      <TabList 
        links={[
          { name: 'Tous', to: '/notifications', end: true },
          { name: 'Mentions', to: '/notifications/mentions', end: false }
        ]}
      />
      <Routes>
        <Route path='/' element={<NotificationsList notifications={uniqueNotifications} />} />
        <Route path='/mentions' element={<h2>Mentions</h2>} />
      </Routes>
    </div>
  );
};

export default Notifications;

const mergeNotifications = (apiNotifications: NotificationTypes[], storeNotifications: NotificationTypes[]): NotificationTypes[] => {
  const mergedNotifications = [...storeNotifications];

  apiNotifications.forEach((notif) => {
    const existsInStore = storeNotifications.some((notifStore) => notif.id === notifStore.id);
    if (!existsInStore) {
      mergedNotifications.push(notif);
    }
  });

  return mergedNotifications.sort((a, b) => {
    return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();
  });
};

const handleUnreadNotifications = (
  notifications: NotificationTypes[], 
  userId: string, 
  updateNotifications: (data: { userId: string; notificationsIds: string }) => void, 
  dispatch: Dispatch
) => {
  const unreadNotifications = notifications.filter((notif) => !notif.isRead);
  const unreadNotificationsIds = unreadNotifications.map((notif) => notif.id);
  
  if (unreadNotificationsIds.length > 0) {
    updateNotifications({ userId, notificationsIds: unreadNotificationsIds.join(',') });
    dispatch(updateNotificationStatus({ ids: unreadNotificationsIds, isRead: true }));
  }
};
