import { useGetPostsQuery } from "../../services/api/postApi";
import PostCard from "./PostCard";

const PostList = () => {
    const { data: posts = [], isLoading, isError } = useGetPostsQuery();
    const sortedPosts = [...posts].sort((a, b) => {
        return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });
    return (
        <div className="post">
            <ul className="post__list">
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error</p>}
                {sortedPosts.map((post) => (
                    <li className="post__item" key={post.id}>
                        <PostCard post={post} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;