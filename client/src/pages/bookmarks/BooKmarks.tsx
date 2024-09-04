import { useSelector } from "react-redux";
import { useGetBookmarkedPostsQuery } from "../../services/api/postApi";
import { RootState } from "../../services/stores";
import PostCard from "../../components/post/PostCard";
import { useEffect } from "react";

const BooKmarks = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const userHandle = useSelector((state: RootState) => state.auth.user?.handle);
  const { data: { data: postsBookmarked } = {}, refetch } = useGetBookmarkedPostsQuery(
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
          {postsBookmarked?.map((post) => (
            <li className="post__item" key={post.id}>
              <PostCard key={post.id} post={post} origin="post-list" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BooKmarks;
