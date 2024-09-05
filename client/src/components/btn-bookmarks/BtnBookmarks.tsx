import { useCallback, useEffect, useState, type FunctionComponent } from 'react';
import { useAddToBookmarksMutation, useGetUserByIdQuery } from '../../services/api/userApi';

interface BtnBookmarksProps {
    postId: string;
    userId: string;
}

const BtnBookmarks: FunctionComponent<BtnBookmarksProps> = ({ postId, userId }) => {
    const { data: { data: user } = {}} = useGetUserByIdQuery(userId);
    const [addToBookmarks] = useAddToBookmarksMutation();
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    useEffect(() => {
        const userBookmarks = user?.bookmarks || []; console.log('userBookmarks:', userBookmarks);
        setIsBookmarked(userBookmarks.map((bookmark) => bookmark.postId).includes(postId));
    }, [postId, user?.bookmarks]);

    const handleAddToBookmarks = useCallback(async () => {
        if (!userId) return;
        try {
            if(postId) {
            await addToBookmarks({ userId, postId });
            }
            // Inversion de l'état uniquement après la réussite de la requête
            setIsBookmarked((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    }, [addToBookmarks, postId, userId]);

    return (
        <div className='btn-bookmarks'>
            <input
                type='checkbox'
                id={`bookmark-${postId}`}
                checked={isBookmarked}
                className='btn-bookmarks__checkbox'
                onChange={handleAddToBookmarks}
                aria-label={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
            />
            <label htmlFor={`bookmark-${postId}`} className='btn-bookmarks__label'>
                <span className='btn-bookmarks__icon'></span>
            </label>
        </div>
    );
};

export default BtnBookmarks;
