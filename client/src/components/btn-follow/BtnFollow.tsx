import { FunctionComponent, memo, useCallback } from 'react';
import { useFollowMutation } from '../../services/api/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/stores';

interface BtnFollowProps {
    followerId: string;
}

const BtnFollow: FunctionComponent<BtnFollowProps> = ({ followerId }) => {
    console.log('follower', followerId);
    
    // Utilisation de useSelector pour récupérer les informations nécessaires depuis le store
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const isFollowing = useSelector((state: RootState) => 
        state.auth.user?.followings?.includes(followerId)
    );
    
    const [follow] = useFollowMutation();

    // Utilisation de useCallback pour mémoiser la fonction handleFollow
    const handleFollow = useCallback(async () => {
        try {
            if (userId) {
                await follow({ followerId, userId });
            }
        } catch (err) {
            console.error(err);
        }
    }, [follow, followerId, userId]);

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