import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import TabList from '../../components/Base/tabList/TabList';
import { Routes, Route } from 'react-router-dom';
import NotificationsList from './NotificationsList';
import useNotifications from './hooks/useNotifications';

const Notifications = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { notifications } = useNotifications(userId as string);
  console.log(notifications);

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
        <Route path='/' element={<NotificationsList notifications={notifications} />} />
        <Route path='/mentions' element={<h2>Mentions</h2>} />
      </Routes>
    </div>
  );
};

export default Notifications;
