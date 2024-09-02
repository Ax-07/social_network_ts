import { useEffect, type FunctionComponent } from "react";
import { useGetUserByIdQuery } from "../../services/api/userApi";
import { NavLink } from "react-router-dom";
import { useGetPostByIdQuery } from "../../services/api/postApi";
import { UserNameHoverDisplayCard, UserThumbnailHoverDisplayCard } from "../userProfile/UserHoverDisplayCard ";
import { useGetCommentByIdQuery } from "../../services/api/commentApi";
import CommentCard from "./CommentCard";

export type PostProps = {
  originalPostId: string;
  orignalCommentId?: string;
  origin?: string;
};

const RepostCard: FunctionComponent<PostProps> = ({ originalPostId, orignalCommentId, origin }) => {
    const { data: { data: postByOriginalId } = {} } = useGetPostByIdQuery(originalPostId ?? "");
    const { data: { data: commentByOriginalId } = {} } = useGetCommentByIdQuery(orignalCommentId ?? 'null');
    const { data: { data: poster } = {} } = useGetUserByIdQuery(postByOriginalId?.userId ?? "");
 
  useEffect(() => {
    console.log('origin', origin)
  }, [origin])
  
  if (!postByOriginalId) return null;
  const isWebp = postByOriginalId.media?.endsWith(".webp");
  const isMp4 = postByOriginalId.media?.endsWith(".mp4");
  const isYoutubeVideo = postByOriginalId.media?.includes("youtube.com");

  return (
    <>
      {origin !== "post-page" && (
        <NavLink to={`/home/posts/${postByOriginalId.id}`} className="post-card__link" />
      )}
      <article className="post-card">
        <UserThumbnailHoverDisplayCard user={poster} />
        <div className="post-card__wrapper">
          <UserNameHoverDisplayCard user={poster} createdAt={postByOriginalId.createdAt} /> 
          {postByOriginalId.content && <p className="post-card__content">{postByOriginalId.content}</p>}
          {postByOriginalId.media && isWebp && (
            <img className="post-card__img" src={postByOriginalId.media} alt="" loading="lazy"/>
            )}
            {postByOriginalId.media && isMp4 && (
              <video className="post-card__video" src={postByOriginalId.media} controls />
              )}
              {postByOriginalId.media && isYoutubeVideo && (
                <iframe
                style={{ width: "100%", aspectRatio: "16/9" }}
                className="post-card__youtube"
                src={postByOriginalId.media}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ></iframe>
                )} 
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

