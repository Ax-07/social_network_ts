import type { FunctionComponent } from 'react';
import { UserNameHoverDisplayCard, UserThumbnailHoverDisplayCard } from '../../components/userProfile/UserHoverDisplayCard ';
import { Link } from 'react-router-dom';
import { useGetUserByIdQuery } from '../../services/api/userApi';
import { NotificationTypes } from '../../utils/types/notification.types';

const NotificationCard: FunctionComponent<NotificationTypes> = (notification) => {
    const {data: {data: sender} = {}} = useGetUserByIdQuery(notification.commenterId); console.log('sender', sender?.username);
    const formatedMessage = (message: string, postId?: string, commentId?: string) => {
        let formatted: React.ReactNode = message;
      
        if (postId) {
          formatted = (
            <p>
              {message.split("post")[0]}{" "}
              <Link to={`/home/posts/${postId}`}> post</Link>
            </p>
          );
        }
      
        if (commentId) {
          formatted = (
            <p>
              {message.split("commentaire")[0]}
              <Link to={`/home/comments/${commentId}`}>commentaire</Link>
            </p>
          );
        }
      
        return formatted;
      };
  return (
    <div className='notification-card'>
      <div className="notification-card__icon">
        <img src="/src/assets/icons/faBell.svg" alt="icon notification"/>
      </div>
      <div className="notification-card__wrapper">
        <div className='notification-card__header'>
        <UserThumbnailHoverDisplayCard user={sender}/>
        <UserNameHoverDisplayCard user={sender} createdAt={notification.createdAt} />
        </div>
        {formatedMessage(notification.message, notification.postId, notification.commentId)}
      </div>
      
    </div>
  );
};

export default NotificationCard;