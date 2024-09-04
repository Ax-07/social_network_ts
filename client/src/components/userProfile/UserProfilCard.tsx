import { useEffect, useState, type FunctionComponent } from 'react';
import { User } from '../../utils/types/user.types';
import { useGetUserByIdQuery } from '../../services/api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';
import MemoizedBtnFollow from '../btn-follow/BtnFollow';

interface UserProfilCardProps {
    user: User | null;
    cardRef: React.RefObject<HTMLDivElement>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const UserProfilCard: FunctionComponent<UserProfilCardProps> = ({user, cardRef, onMouseLeave, onMouseEnter}) => {
    const {data: {data: userData} = {}} = useGetUserByIdQuery(user?.id ?? ''); console.log('userData:', userData?.followers);
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
    <div className='userProfile-card'
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <div className="profile__info">
        <div className="profile__info-header">
          <img className="userprofile__picture"
            src={ user?.profilPicture ? user.profilPicture : "/images/Default-user-picture.png" }
            alt="User Profile Thumbnail"
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
            <div className="profile__info-follow-row">
                <h3 className="fs-20-700">{user?.followings?.length} Abonnements</h3>
            </div>
            <div className="profile__info-follow-row">
                <h3 className="fs-20-700">{user?.followers?.length} Abonnés</h3>
            </div>
            <p className="fs-15-600">Suivi par {
              filteredFollowersNames && filteredFollowersNames?.map((followerName, index) => (
                <span key={index}>{followerName}{index === filteredFollowersNames.length - 1 ? ' ' : ', '}</span>
              ))
              } que vous suivez</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilCard;