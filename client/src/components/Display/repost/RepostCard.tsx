import { FunctionComponent } from "react";
import { useGetUserByIdQuery } from "../../../services/api/userApi";
import { NavLink } from "react-router-dom";
import { useGetPostByIdQuery } from "../../../services/api/postApi";
import { UserNameHoverDisplayCard, UserThumbnailHoverDisplayCard } from "../../userProfile/UserHoverDisplayCard ";
import { useGetCommentByIdQuery } from "../../../services/api/commentApi";
import CommentCard from "../comment/CommentCard";
import MediaDisplay from "../../Base/mediaDisplay/MediaDisplay";
import QuestionCard from "../question/QuestionCard";

export type PostProps = {
  originalPostId: string;
  originalCommentId?: string;
  origin?: string;
};

const RepostCard: FunctionComponent<PostProps> = ({ originalPostId, originalCommentId, origin }) => {
    const { data: { data: postByOriginalId } = {} } = useGetPostByIdQuery(originalPostId ?? "");
    const { data: { data: commentByOriginalId } = {} } = useGetCommentByIdQuery(originalCommentId ?? "");
    const { data: { data: poster } = {} } = useGetUserByIdQuery(postByOriginalId?.userId ?? "");
  
  if (!postByOriginalId) return null;

  return (
    <>
      {origin !== "post-page" && (
        <NavLink to={`/home/posts/${postByOriginalId.id}`} className="post-card__link" />
      )}
      <article className="post-card">
        <UserThumbnailHoverDisplayCard user={poster} />
        <div className="post-card__wrapper">
          <UserNameHoverDisplayCard user={poster} createdAt={postByOriginalId.createdAt} /> 
          {postByOriginalId.content &&
            <p className="post-card__content">{postByOriginalId.content}</p>
          }
          <MediaDisplay media={postByOriginalId.media}/>
          {postByOriginalId.question && 
            <QuestionCard question={postByOriginalId.question} />
          }
          {commentByOriginalId && 
            <div>
              <CommentCard comment={commentByOriginalId} origin="repost" />
          </div>
          }
        </div>
      </article>
    </>
  );
};

export default RepostCard;

