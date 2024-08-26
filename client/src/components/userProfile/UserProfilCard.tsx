import { useEffect, useState, type FunctionComponent } from 'react';
import { User } from '../../utils/types/user.types';
import { useGetFollowersNamesQuery } from '../../services/api/userApi';
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
    const { data: followersData } = useGetFollowersNamesQuery(user?.id ?? '');
    const [filteredFollowersNames, setFilteredFollowersNames] = useState<string[]>([]);
    const userName = useSelector((state: RootState) => state?.auth?.user?.username);

    useEffect(() => {
        if (followersData?.data?.followersNames && userName) {
            const filteredNames = followersData.data.followersNames.filter(
                (followerName) => followerName !== userName
            );
            setFilteredFollowersNames(filteredNames);
        }
    }, [followersData, userName]);

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
          <MemoizedBtnFollow followerId={user?.id ?? ''} />
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