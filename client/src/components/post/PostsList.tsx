import { useGetPostsQuery } from "../../services/api/postApi";
import PostCard from "./PostCard";
import AddPost from "./AddPost";
import TabList from "../tabList/TabList";
import { PostFormProvider } from "./context/postFormContext";

const PostList = () => {
  const { data: posts, isLoading, isError } = useGetPostsQuery();
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;
  const sortedPosts = [...(posts?.data ?? [])].sort((a, b) => {
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  });

  return (
    <div className="post">
      <TabList
        links={[
          { name: "Pour vous", to: "/home/posts" },
          { name: "Abonnements", to: "/home/abonnements" },
        ]}
      />
      <PostFormProvider origin="page-home">
        <AddPost origin="page-home" />
      </PostFormProvider>
      <ul className="post__list">
        {sortedPosts.map((post) => (
          <li className="post__item" key={post.id}>
            <PostCard key={post.id} post={post} origin="post-list"/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
