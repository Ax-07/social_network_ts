import { FunctionComponent, memo, useCallback } from 'react';
import { useGetUserByIdQuery } from '../../../services/api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../services/stores';
import { useFollowMutation } from '../../../services/api/followApi';

interface BtnFollowProps {
    userToFollowId: string;
}

const BtnFollow: FunctionComponent<BtnFollowProps> = ({ userToFollowId }) => {
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const userFollowers = useGetUserByIdQuery(userToFollowId).data?.data?.followers;
    const isFollowing = userFollowers?.some((follower) => follower.id === userId);
    
    const [follow] = useFollowMutation();

    // Utilisation de useCallback pour mémoiser la fonction handleFollow
    const handleFollow = useCallback(async () => {
        try {
            if (userId) {
                await follow({ userId, userToFollowId });
            }
        } catch (err) {
            console.error(err);
        }
    }, [follow, userToFollowId, userId]);

    return (
        <div>
            <button className="btn btn-follow" onClick={handleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
        </div>
    );
};

// Utilisation de React.memo pour éviter les re-rendus inutiles
// Nommer explicitement l'export du composant mémoisé
const MemoizedBtnFollow = memo(BtnFollow);
export default MemoizedBtnFollow;