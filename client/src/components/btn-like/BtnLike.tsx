import { FunctionComponent, useState } from "react";
import { useLikePostMutation } from "../../services/api/postApi";
import { PostTypes } from "../../utils/types/post.types";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import { usePushToast } from "../toast/Toasts";
import { ApiError } from "../../utils/types/api.types";
import { CommentTypes } from "../../utils/types/comment.types";
import { useLikeCommentMutation } from "../../services/api/commentApi";

interface BtnLikeProps {
  post?: PostTypes;
  comment?: CommentTypes;
}

const BtnLike: FunctionComponent<BtnLikeProps> = ({ post, comment }) => {
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  const [likePost] = useLikePostMutation();
  const [likeComment] = useLikeCommentMutation();
  const postId = post?.id;
  const commentId = comment?.id;
  const commentedPostId = comment?.postId;
  const commentedCommentId = comment?.commentId;
  const postLikers = Array.isArray(post?.likers) ? post?.likers : [];  // S'assurer que c'est un tableau
  const commentLikers = Array.isArray(comment?.likers) ? comment?.likers : [];  // S'assurer que c'est un tableau
  const pushToast = usePushToast();

  const [isPostLiked, setIsPostLiked] = useState(postLikers.map((liker) => liker.id).includes(userId ?? ""));
  const [isCommentLiked, setIsCommentLiked] = useState(commentLikers.map((liker) => liker.id).includes(userId ?? ""));

  const handleLike = async () => {
    try {
      if (!userId) {
        pushToast({ type: "error", message: "Vous devez être connecté pour aimer un post" });
        return;
      }
      let response;
      if(postId) {
      response = await likePost({
        id: postId ?? "",
        likerId: userId ?? "",
      }).unwrap();
      setIsPostLiked((prev) => !prev);
    } else if (commentId) {
      response = await likeComment({
        id: comment?.id ?? "",
        likerId: userId ?? "",
        commentedPostId: commentedPostId ?? "",
        commentedCommentId: commentedCommentId ?? "",
      }).unwrap();
      setIsCommentLiked((prev) => !prev);
    }
      pushToast({ type: "success", message: response?.message || "" });
    } catch (error) {
      pushToast({ type: "error", message: (error as ApiError).data.message });
      console.error(error);
    }
  };

  const uniqueId = postId ? `post-like-${postId}` : `comment-like-${commentId}`;


  return (
    <div className="row-10">
      <div className="btn__like">
        <input
          type="checkbox"
          id={uniqueId}
          className="btn__like-checkbox"
          checked={post ? isPostLiked : isCommentLiked}
          onChange={handleLike}
          aria-label={`Aimer ce ${post ? 'post' : 'commentaire'} ${post ? isPostLiked ? 'Annuler' : 'Aimer' : isCommentLiked ? 'Annuler' : 'Aimer'}`}
        />
        <label htmlFor={uniqueId} className="btn__like-label">
          <span className="btn__like-icon"></span>
        </label>
      </div>
      { post && <span className="btn__like-count">{postLikers.length}</span> }
      { comment && <span className="btn__like-count">{commentLikers.length}</span> }
    </div>
  );
};

export default BtnLike;
