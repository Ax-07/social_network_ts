import { useEffect, type FunctionComponent } from "react";
import { useGetUserByIdQuery } from "../../../services/api/userApi";
import { NavLink } from "react-router-dom";
import { useGetPostByIdQuery } from "../../../services/api/postApi";
import { UserNameHoverDisplayCard, UserThumbnailHoverDisplayCard } from "../../userProfile/UserHoverDisplayCard ";
import { useGetCommentByIdQuery } from "../../../services/api/commentApi";
import CommentCard from "../comment/CommentCard";
import MediaDisplay from "../../Base/mediaDisplay/MediaDisplay";

export type PostProps = {
  originalPostId: string;
  originalCommentId?: string;
  origin?: string;
};

const RepostCard: FunctionComponent<PostProps> = ({ originalPostId, originalCommentId, origin }) => {
    const { data: { data: postByOriginalId } = {} } = useGetPostByIdQuery(originalPostId ?? "");
    const { data: { data: commentByOriginalId } = {} } = useGetCommentByIdQuery(originalCommentId ?? "");
    const { data: { data: poster } = {} } = useGetUserByIdQuery(postByOriginalId?.userId ?? "");
 
  useEffect(() => {
    console.log('origin', origin)
  }, [origin])
  
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
          <p className="post-card__content">{postByOriginalId.content}</p>
          <MediaDisplay media={postByOriginalId.media}/>
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

