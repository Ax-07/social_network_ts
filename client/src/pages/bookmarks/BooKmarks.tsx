import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import PostCard from "../../components/Display/post/PostCard";
import { useEffect } from "react";
import { useGetBookmarksQuery } from "../../services/api/bookmarkApi";
import CommentCard from "../../components/Display/comment/CommentCard";

const BooKmarks = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const userHandle = useSelector((state: RootState) => state.auth.user?.handle);
  const { data: { data: postsBookmarked } = {}, refetch } = useGetBookmarksQuery(
    userId as string
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-page__header">
        <h1>BooKmarks</h1>
        <p>{userHandle}</p>
        <div>searchBar</div>
      </div>
      <div className="post">
        <ul className="post__list">
          {postsBookmarked?.map((bookmark) => (
            <li className="post__item" key={bookmark.id}>
              {bookmark.post && <PostCard key={bookmark.postId} post={bookmark.post} origin="post-list" />}
              {bookmark.comment && <CommentCard key={bookmark.commentId} comment={bookmark.comment} origin="comment-list"/>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BooKmarks;
