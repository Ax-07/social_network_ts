import { FunctionComponent, useEffect } from "react";
import { useGetCommentsByCommentIdQuery, useGetCommentsByPostIdQuery } from "../../services/api/commentApi";
import CommentCard from "./CommentCard";
import { useModal } from "../modal/hook/useModal";

interface CommentListProps {
    postId?: string | undefined;
    commentId?: string | undefined;
}

const CommentList: FunctionComponent<CommentListProps> = ({postId, commentId}) => {
    const { data: postComments, isLoading: isLoadingPostComments, isError: isErrorPostComments } = useGetCommentsByPostIdQuery(postId ?? "");
    const { data: commentComments, isLoading: isLoadingCommentComments, isError: isErrorCommentComments } = useGetCommentsByCommentIdQuery(commentId ?? "");
    const { setCommentedPostId, setCommentedCommentId } = useModal();

    useEffect(() => {
    if (postId) {
        setCommentedPostId(postId ?? "");
    } else {
        setCommentedCommentId(commentId ?? "");
    }
    }, [postId, commentId, setCommentedPostId, setCommentedCommentId]);

    // Déterminer quelle donnée afficher
    const comments = postId && !commentId ? postComments : commentComments;
    const isLoading = postId && !commentId ? isLoadingPostComments : isLoadingCommentComments;
    const isError = postId && !commentId ? isErrorPostComments : isErrorCommentComments;
    
    const sortedComments = [...(comments?.data ?? [])].sort((a, b) => {
        return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error</p>;

    console.log('comments', comments);
    return (
        <ul className="post__list">
            {sortedComments.map((comment) => (
                <li className="post__item" key={comment.id}>
                    <CommentCard key={comment.id} comment={comment} origin="post-page"/>
                </li>
            ))}
        </ul>
    );
};

export default CommentList;