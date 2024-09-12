import { useCallback, useEffect, useState, type FunctionComponent } from 'react';
import { useGetBookmarksQuery, useToggleBookmarkMutation } from '../../../services/api/bookmarkApi';
import { usePushToast } from '../../toast/useToast';

interface BtnBookmarksProps {
    userId: string;
    postId?: string;
    commentId?: string;
}

const BtnBookmarks: FunctionComponent<BtnBookmarksProps> = ({ postId, userId, commentId }) => {
    const { data: { data: bookmarks } = {} } = useGetBookmarksQuery(userId);
    const [toggleBookmark] = useToggleBookmarkMutation();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const pushToast = usePushToast();

    useEffect(() => {
        if (!bookmarks) return;
      const idToCheck = postId || commentId;
      if (idToCheck) {
        setIsBookmarked(bookmarks.some((bookmark) => (bookmark.postId || bookmark.commentId) === idToCheck));
      }
    }, [postId, commentId, bookmarks]);
  
    const handleToggleBookmark = useCallback(async () => {
      if (!userId) return;
      try {
        await toggleBookmark({ userId, postId, commentId });
        setIsBookmarked((prev) => !prev);  // Inverser l'état après succès de l'API
        if (isBookmarked) {
          pushToast({ type: "success", message: "Retiré des favoris" });
        } else {
          pushToast({ type: "success", message: "Ajouté aux favoris" });
        }
      } catch (error) {
        console.error(error);
      }
    }, [userId, toggleBookmark, postId, commentId, isBookmarked, pushToast]);
  
    return (
      <div className='btn-bookmarks'>
        <input
          type='checkbox'
          id={`bookmark-${postId || commentId}`}
          checked={isBookmarked}
          className='btn-bookmarks__checkbox'
          onChange={handleToggleBookmark}
          aria-label={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
        />
        <label htmlFor={`bookmark-${postId || commentId}`} className='btn-bookmarks__label'>
          <span className='btn-bookmarks__icon'></span>
        </label>
      </div>
    );
  };
  

export default BtnBookmarks;
