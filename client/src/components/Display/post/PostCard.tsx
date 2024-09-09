import { useEffect, useRef, type FunctionComponent } from "react";
import BtnLike from "../../Actions/btn-like/BtnLike";
import { useGetUserByIdQuery } from "../../../services/api/userApi";
import { NavLink } from "react-router-dom";
import { PostTypes } from "../../../utils/types/post.types";
import BtnRepost from "../../Actions/btn-repost/BtnRepost";
import BtnComment from "../../Actions/btn-comment/BtnComment";
import RepostCard from "../repost/RepostCard";
import BtnViews from "../../Actions/btn-views/BtnViews";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/stores";
import BtnBookmarks from "../../Actions/btn-bookmarks/BtnBookmarks";
import interceptor from "../../../utils/functions/interceptor";
import { UserNameHoverDisplayCard, UserThumbnailHoverDisplayCard } from "../../userProfile/UserHoverDisplayCard ";
import { cachePostView } from "../../../utils/functions/cachePostViews";
import MediaDisplay from "../../Base/mediaDisplay/MediaDisplay";

export type PostProps = {
  post: PostTypes;
  origin?: string;
};

const PostCard: FunctionComponent<PostProps> = ({ post, origin }) => {
  const posterId = post.userId;
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: { data: poster } = {} } = useGetUserByIdQuery(posterId);
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
          <MediaDisplay media={post.media}/>
          {post.originalPostId && 
          (<div className="post-card__repost-card">
            <RepostCard originalPostId={post.originalPostId as string} origin=""/>
          </div>
        )}

          <div className="post-card__footer">
            <BtnComment postId={post.id} commentsCount={post.commentsCount} />
            <BtnRepost origin="modal-repost" postId={post.id} reposterCount={post.reposters?.length ?? 0}/>
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
