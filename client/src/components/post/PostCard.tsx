import { useEffect, useRef, type FunctionComponent } from "react";
import BtnLike from "../btn-like/BtnLike";
import { useGetUserByIdQuery } from "../../services/api/userApi";
import { NavLink } from "react-router-dom";
import { PostTypes } from "../../utils/types/post.types";
import BtnRepost from "../btn-repost/BtnRepost";
import BtnComment from "../btn-comment/BtnComment";
import { PostFormProvider } from "./context/postFormContext";
import RepostCard from "./RepostCard";
import BtnViews from "../btn-views/BtnViews";
import { useSelector } from "react-redux";
import { RootState } from "../../services/stores";
import BtnBookmarks from "../btn-bookmarks/BtnBookmarks";
import interceptor from "./functions/interceptor";
import { UserNameHoverDisplayCard, UserThumbnailHoverDisplayCard } from "../userProfile/UserHoverDisplayCard ";
import { cachePostView } from "./functions/cachePostViews";

export type PostProps = {
  post: PostTypes;
  origin?: string;
};

const PostCard: FunctionComponent<PostProps> = ({ post, origin }) => {
  const posterId = post.userId;
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: { data: poster } = {} } = useGetUserByIdQuery(posterId);
  const isWebp = post?.media?.endsWith(".webp");
  const isMp4 = post?.media?.endsWith(".mp4");
  const isYoutubeVideo = post?.media?.includes("youtube.com");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    interceptor({ action: () => posterId !== userId && cachePostView(post.id), ref: cardRef });
  }, [cardRef, post.id]);
  
  return (
    <>
      {origin !== "post-page" && (
        <NavLink to={`/home/posts/${post.id}`} className="post-card__link" />
      )}
      <article className="post-card" ref={cardRef} aria-labelledby={`post-title-${post.id}`}>
      <UserThumbnailHoverDisplayCard user={poster} />
        <div className="post-card__wrapper">
          <UserNameHoverDisplayCard user={poster} createdAt={post.createdAt} />
          {post.content && (
            <p className="post-card__content" id={`post-title-${post.id}`}>
              {post.content}
            </p>
          )}
          
          {/* Utilisation de <figure> pour les médias */}
          {post.media && isWebp && (
            <figure className="post-card__media">
              <img className="post-card__img" src={post.media} alt="Image du post" loading="lazy" />
              <figcaption className="sr-only">Aperçu de l'image</figcaption>
            </figure>
          )}
          {post.media && isMp4 && (
            <figure className="post-card__media">
              <video className="post-card__video" src={post.media} controls aria-label="Vidéo du post" />
              <figcaption className="sr-only">Vidéo du post</figcaption>
            </figure>
          )}
          {post.media && isYoutubeVideo && (
            <figure className="post-card__media">
              <iframe
                style={{ width: "100%", aspectRatio: "16/9" }}
                className="post-card__youtube"
                src={post.media}
                title="Lecteur vidéo YouTube"
                aria-label="Vidéo YouTube du post"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
              <figcaption className="sr-only">Vidéo YouTube du post</figcaption>
            </figure>
          )}
          {post.originalPostId && 
          (<div className="post-card__repost-card">
            <RepostCard originalPostId={post.originalPostId as string} origin=""/>
          </div>
        )}

          <div className="post-card__footer">
            <BtnComment postId={post.id} commentsCount={post.commentsCount} />
            <PostFormProvider origin="modal-repost">
              <BtnRepost postId={post.id} reposterCount={post.reposters?.length ?? 0}/>
            </PostFormProvider>
            <BtnLike post={post} />
            <BtnViews viewsCount={post.views} />
            <BtnBookmarks postId={post.id} userId={userId ?? ""}/>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostCard;
