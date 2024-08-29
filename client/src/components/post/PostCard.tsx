import { useRef, type FunctionComponent } from "react";
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
import { UserNameHoverDisplayCard, UserThumbnailHoverDisplayCard } from "../userProfile/UserHoverDisplayCard ";

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

  return (
    <>
      {origin !== "post-page" && (
        <NavLink to={`/home/posts/${post.id}`} className="post-card__link" />
      )}
      <article className="post-card" ref={cardRef}>
        <UserThumbnailHoverDisplayCard user={poster} />
        <div className="post-card__wrapper">
          <UserNameHoverDisplayCard user={poster} createdAt={post.createdAt} />
          {post.content && <p className="post-card__content">{post.content}</p>}
          {post.media && isWebp && (
            <img className="post-card__img" src={post.media} alt="" loading="lazy"/>
          )}
          {post.media && isMp4 && (
            <video className="post-card__video" src={post.media} controls />
          )}
          {post.media && isYoutubeVideo && (
            <iframe
              style={{ width: "100%", aspectRatio: "16/9" }}
              className="post-card__youtube"
              src={post.media}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          {post.originalPostId && 
          (<div className="post-card__repost-card">
            <RepostCard originalPostId={post.originalPostId as string} origin=""/>
          </div>
        )}

          <div className="post-card__footer">
            <BtnComment postId={post.id} commentsCount={post.commentsCount} />
            <PostFormProvider origin="modal-repost">
              <BtnRepost postId={post.id} reposterCount={post.reposters?.length}/>
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

