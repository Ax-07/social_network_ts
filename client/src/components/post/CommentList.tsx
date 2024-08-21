import { FunctionComponent } from "react";
import { useGetCommentsByCommentIdQuery, useGetCommentsByPostIdQuery } from "../../services/api/commentApi";
import CommentCard from "./CommentCard";

interface CommentListProps {
    postId?: string | undefined;
    commentId?: string | undefined;
}

const CommentList: FunctionComponent<CommentListProps> = ({postId, commentId}) => {
    const { data: postComments, isLoading: isLoadingPostComments, isError: isErrorPostComments } = useGetCommentsByPostIdQuery(postId ?? "");
    const { data: commentComments, isLoading: isLoadingCommentComments, isError: isErrorCommentComments } = useGetCommentsByCommentIdQuery(commentId ?? "");

    // Déterminer quelle donnée afficher
    const comments = postId && !commentId ? postComments : commentComments;
    const isLoading = postId && !commentId ? isLoadingPostComments : isLoadingCommentComments;
    const isError = postId && !commentId ? isErrorPostComments : isErrorCommentComments;

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error</p>;
    return (
        <ul className="post__list">
            {comments?.data.map((comment) => (
                <li className="post__item" key={comment.id}>
                    <CommentCard key={comment.id} comment={comment} origin="post-page"/>
                </li>
            ))}
        </ul>
    );
};

export default CommentList;