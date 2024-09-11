import { useEffect, useState, type FunctionComponent } from 'react';
import { User } from '../../utils/types/user.types';
import { useGetUserByIdQuery } from '../../services/api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import MemoizedBtnFollow from '../Actions/btn-follow/BtnFollow';

interface UserProfilCardProps {
    user: User | null;
    cardRef: React.RefObject<HTMLDivElement>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const UserProfilCard: FunctionComponent<UserProfilCardProps> = ({user, cardRef, onMouseLeave, onMouseEnter}) => {
    const {data: {data: userData} = {}} = useGetUserByIdQuery(user?.id ?? '');
    const [filteredFollowersNames, setFilteredFollowersNames] = useState<string[]>([]);
    const userName = useSelector((state: RootState) => state?.auth?.user?.username); // username de l'utilisateur connecter

    useEffect(() => {
      if (userData?.followers && user?.username && userName) {
          const filteredNames = userData.followers.filter(
              (follower) => follower.username !== user?.username && follower.username !== userName
          ).map((follower) => follower.username);
          setFilteredFollowersNames(filteredNames);
      }
  }, [user?.username, userName, userData]);

    return (
    <div className='userProfile-card' ref={cardRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="profile__info">
        <div className="profile__info-header">
          <img className="userprofile__picture"
            src={ user?.profilPicture ? user.profilPicture : "/images/Default-user-picture.png" }
            alt={`Photo de profil de ${user?.username ?? "l'utilisateur"}`}
            loading="lazy"
          />
          <MemoizedBtnFollow userToFollowId={user?.id ?? ''} />
        </div>
        <div className="profile__info-body">
          <h3 className="fs-20-700">{user?.username}</h3>
          <p className="fs-15-600">{user?.email}</p>
          <p className="fs-15-600">{user?.bio}</p>
        </div>
        <div className="profile__info-follow">
          <ul className="profile__info-follow-list">
            <li className="profile__info-follow-row">
              <h3 className="fs-20-700" aria-label={`${user?.followings?.length ?? 0} abonnements`}>
                {user?.followings?.length ?? 0} Abonnements
              </h3>
            </li>
            <li className="profile__info-follow-row">
              <h3 className="fs-20-700" aria-label={`${user?.followers?.length ?? 0} abonnés`}>
                {user?.followers?.length ?? 0} Abonnés
              </h3>
            </li>
          </ul>
          {filteredFollowersNames.length > 0 ? (
            <p className="fs-15-600">
              Suivi par{' '}
              {filteredFollowersNames.map((followerName, index) => (
                <span key={index}>{followerName}{index === filteredFollowersNames.length - 1 ? ' ' : ', '}</span>
              ))}
              que vous suivez
            </p>
          ) : (
            <p className="fs-15-600">Aucun de vos abonnés ne suit cet utilisateur.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilCard;