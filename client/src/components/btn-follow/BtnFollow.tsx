import { FunctionComponent, memo, useCallback } from 'react';
import { useFollowMutation, useGetUserByIdQuery } from '../../services/api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';

interface BtnFollowProps {
    userToFollowId: string;
}

const BtnFollow: FunctionComponent<BtnFollowProps> = ({ userToFollowId }) => {
    console.log('userToFollowId', userToFollowId);
    
    // Utilisation de useSelector pour récupérer les informations nécessaires depuis le store
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const userFollowers = useGetUserByIdQuery(userToFollowId).data?.data?.followers; console.log('userFollowers:', userFollowers);
    const isFollowing = userFollowers?.some((follower) => follower.id === userId); console.log('isFollowing:', isFollowing);
    
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