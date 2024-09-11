import { useCallback, useEffect, useState, type FunctionComponent } from 'react';
import { useGetBookmarksQuery, useToggleBookmarkMutation } from '../../../services/api/bookmarkApi';

interface BtnBookmarksProps {
    userId: string;
    postId?: string;
    commentId?: string;
}

const BtnBookmarks: FunctionComponent<BtnBookmarksProps> = ({ postId, userId, commentId }) => {
    const { data: { data: bookmarks } = {} } = useGetBookmarksQuery(userId);
    const [toggleBookmark] = useToggleBookmarkMutation();
    const [isBookmarked, setIsBookmarked] = useState(false);
  
    useEffect(() => {
        console.log(bookmarks);
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
      } catch (error) {
        console.error(error);
      }
    }, [toggleBookmark, userId, postId, commentId]);
  
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
