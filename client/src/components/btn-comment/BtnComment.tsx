import type { FunctionComponent } from "react";
import ButtonModal from "../modal/ButtonModal";
import { PostFormOrigin } from "../post/PostForm";

interface BtnCommentProps {
  postId?: string;
  commentsCount?: number;
  commentId?: string;
}

const BtnComment: FunctionComponent<BtnCommentProps> = ({
  postId,
  commentId,
  commentsCount,
}) => {
  let modaleName: PostFormOrigin;
  if (postId) {
    modaleName = "modal-comment-post";
  } else {
    modaleName = "modal-comment-comment";
  }
  return (
    <ButtonModal
      modalName={modaleName}
      postId={postId}
      commentId={commentId}
      className="btn__modal-comment"
      aria-label={`Commenter ce ${postId ? 'post' : 'commentaire'}. ${commentsCount} commentaires`}
    >
      <img src="/src/assets/icons/faMessage.svg" alt="Icône de commentaire" />
      <p>{commentsCount}</p>
    </ButtonModal>
  );
};

export default BtnComment;
