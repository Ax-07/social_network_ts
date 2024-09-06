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
          <figure className="post-card__media">
            <img className="post-card__img" src={postByOriginalId.media} alt="Aperçu du post" loading="lazy" />
            <figcaption className="sr-only">Aperçu de l'image</figcaption>
            </figure>
          )}
          {postByOriginalId.media && isMp4 && (
            <figure className="post-card__media">
              <video className="post-card__video" src={postByOriginalId.media} controls aria-label="Vidéo du post" />
              <figcaption className="sr-only">Vidéo du post</figcaption>
            </figure>
          )}
          {postByOriginalId.media && isYoutubeVideo && (
            <figure className="post-card__media">
              <iframe
                style={{ width: "100%", aspectRatio: "16/9" }}
                className="post-card__youtube"
                src={postByOriginalId.media}
                title="Lecteur vidéo YouTube"
                aria-label="Vidéo YouTube du post"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            <figcaption className="sr-only">Vidéo YouTube du post</figcaption>
          </figure>
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

