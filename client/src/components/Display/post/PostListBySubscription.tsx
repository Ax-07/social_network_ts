import { useSelector } from "react-redux";
import { useGetPostBySubscriptionQuery } from "../../../services/api/postApi";
import PostCard from "./PostCard";
import { RootState } from "../../../services/stores";

const PostListBySubscription = () => {
    const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: {data: posts} = {}, isLoading, isError } = useGetPostBySubscriptionQuery(userId ?? ""); console.log(posts);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;
  const sortedPosts = [...(posts ?? [])].sort((a, b) => {
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  });

  return (
    <div className="post">
      <ul className="post__list">
        {sortedPosts.map((post) => (
          <li className="post__item" key={post.id}>
            <PostCard post={post} origin="post-list"/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostListBySubscription;
