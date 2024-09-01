import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import { useGetAllNotificationsByUserIdQuery } from '../../services/api/notificationApi';
import { NotificationTypes } from '../../utils/types/notification.types';
import TabList from '../../components/tabList/TabList';
import { Routes, Route } from 'react-router-dom';
import NotificationsList from './NotificationsList';

const Notifications: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const notificationsFromStore = useSelector((state: RootState) => state.notifications.notifications);
  const {data: {data: notificationFromApi} = {}} = useGetAllNotificationsByUserIdQuery(userId as string);
  const [uniqueNotifications, setUniqueNotifications] = useState<NotificationTypes[]>([]);
  
  useEffect(() => {
    if (notificationFromApi) {
      const mergedNotifications = [...notificationsFromStore]; console.log('mergedNotifications', mergedNotifications);

      notificationFromApi.forEach((notif) => {
        const existsInStore = notificationsFromStore.some((notifStore) => notif.id === notifStore.id);
        if (!existsInStore) {
          mergedNotifications.push(notif);
        }
      });

      const sortedNotifications = mergedNotifications.sort((a, b) => {
        return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();
      });

      setUniqueNotifications(sortedNotifications);
    }
  }, [notificationFromApi, notificationsFromStore]);


  return (
    <div className='notification-page'>
      <h2 className='notification-page__title'>Notifications</h2>
      <TabList 
        links={[
          {name: 'Tous', to: '/notifications', end: true},
          {name: 'Mentions', to: '/notifications/mentions', end: false}
        ]}
        />
        <Routes>
          <Route path='/' element={<NotificationsList notifications={uniqueNotifications}/>} />
          <Route path='/mentions' element={<h2>Mentions</h2>} />
        </Routes>
    </div>
  );
};

export default Notifications;
