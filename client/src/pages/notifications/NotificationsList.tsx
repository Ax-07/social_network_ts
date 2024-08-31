import type { FunctionComponent } from 'react';
import { NotificationTypes } from '../../utils/types/notification.types';
import NotificationCard from './NotificationCard';

interface NotificationsListProps{
    notifications: NotificationTypes[];
}

const NotificationsList: FunctionComponent<NotificationsListProps> = ({notifications}) => {
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