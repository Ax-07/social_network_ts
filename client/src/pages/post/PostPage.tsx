import { NavLink, useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../../services/api/postApi";
import PostCard from "../../components/post/PostCard";
import AddComment from "../../components/post/AddComment";
import CommentList from "../../components/post/CommentList";
import { PostFormProvider } from "../../components/post/context/postFormContext";

const PostPage = () => {
    const { id } = useParams<{ id: string }>(); console.log(id);
    const { data: post, error, isLoading } = useGetPostByIdQuery(id as string);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    // Vérifiez si `post` est défini avant de rendre `PostCard`
    if (!post) return <div>No post found</div>;

    return (
        <section className="post-page">
            <div>
            <NavLink to={"/home"}>
                <img src="/src/assets/icons/faArrowLeft.svg" alt="icon arrow left" />
            </NavLink>
            </div>
            <PostCard post={post.data} origin="post-page"/>
            <PostFormProvider origin="post-page-comment">
                <AddComment origin="post-page-comment" />
            </PostFormProvider>
            <CommentList postId={id} />
        </section>
    );
};

export default PostPage;
