import { NavLink, useParams } from "react-router-dom";
import { useGetCommentByIdQuery } from "../../services/api/commentApi";
import CommentCard from "../../components/Display/comment/CommentCard";
import AddComment from "../../components/Form/AddComment";
import CommentList from "../../components/Display/comment/CommentList";
import { PostFormProvider } from "../../components/Form/context/postFormContext";

const CommentPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: comment, error, isLoading } = useGetCommentByIdQuery(id as string);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    // Vérifiez si `comment` est défini avant de rendre `CommentCard`
    if (!comment) return <div>No comment found</div>;

    return (
        <section className="post-page">
            <div>
            <NavLink to={"/home"}>
                <img src="/src/assets/icons/faArrowLeft.svg" alt="icon arrow left" />
            </NavLink>
            </div>
            <CommentCard comment={comment.data} origin="comment-page"/>
            <PostFormProvider origin="comment-page-comment">
                <AddComment origin="comment-page-comment" />
            </PostFormProvider>
            <CommentList commentId={id}/>
        </section>
    );
};

export default CommentPage;