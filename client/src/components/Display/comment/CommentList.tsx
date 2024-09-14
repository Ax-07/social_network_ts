import { FunctionComponent } from "react";
import { useGetCommentsByCommentIdQuery, useGetCommentsByPostIdQuery } from "../../../services/api/commentApi";
import CommentCard from "./CommentCard";

interface CommentListProps {
    postId?: string | undefined;
    commentId?: string | undefined;
}
const CommentList: FunctionComponent<CommentListProps> = ({ postId, commentId }) => {
    const { data: commentsByPost, isLoading: isLoadingPostRelatedComments, isError: hasErrorLoadingPostComments } = useGetCommentsByPostIdQuery(postId ?? "");
    const { data: repliesByComment, isLoading: isLoadingCommentReplies, isError: hasErrorLoadingCommentReplies } = useGetCommentsByCommentIdQuery(commentId ?? "");

    // Déterminer quelle donnée afficher
    const comments = postId && !commentId ? commentsByPost : repliesByComment;
    const isLoading = postId && !commentId ? isLoadingPostRelatedComments : isLoadingCommentReplies;
    const isError = postId && !commentId ? hasErrorLoadingPostComments : hasErrorLoadingCommentReplies;

    const sortedComments = [...(comments?.data ?? [])].sort((a, b) => {
        return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error</p>;

    return (
        <ul className="post__list">
            {sortedComments.map((comment) => (
                <li className="post__item" key={comment.id}>
                    <CommentCard key={comment.id} comment={comment} origin="post-list" />
                </li>
            ))}
        </ul>
    );
};

export default CommentList;