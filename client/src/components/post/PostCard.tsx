import type { FunctionComponent } from "react";
import BtnLike from "../btn-like/BtnLike";
import { useGetUserByIdQuery } from "../../services/api/userApi";
import { getTimeSinceCreation } from "../../utils/functions/formatedDate";
import { Link, NavLink } from "react-router-dom";
import { PostTypes } from "../../utils/types/post.types";
import BtnRepost from "../btn-repost/BtnRepost";
import BtnComment from "../btn-comment/BtnComment";

export type PostProps = {
  post: PostTypes;
  origin?: string;
};

const PostCard: FunctionComponent<PostProps> = ({ post, origin }) => {
  const posterId = post.userId;
  const { data: { data: poster } = {} } = useGetUserByIdQuery(posterId);
  const isWebp = post.media?.endsWith(".webp");
  const isMp4 = post.media?.endsWith(".mp4");
  const isYoutubeVideo = post.media?.includes("youtube.com");
  const timeSinceCreation = getTimeSinceCreation(post.createdAt as string);

  return (
    <>
    {origin != "post-page" && <NavLink to={`/home/posts/${post.id}`} className="post__card-link">
    </NavLink>}
    <article className="post__card">
      <div className="post__card-user">
        <Link to={`/profile/${posterId}`}>
        <img
          className="userprofile__picture"
          src={poster?.profilPicture ? poster?.profilPicture : "/images/Default-user-picture.png"}
          alt="User Profile Thumbnail"
          loading="lazy"
        />
        </Link>
      </div>
      <div className="post__card-wrapper">
        <div className="post__card-header">
            <h3 className="post__card-username fs-16-700">{poster?.username}</h3>
            <p className="post__card-handle fs-15-400">{poster?.handle}</p>
          <p className="post__card-date fs-15-400">{timeSinceCreation}</p>
        </div>
        <p className="post__card-content">{post.content}</p>
        {post.media && isWebp && (
          <img
            className="post__card-img"
            src={post.media}
            alt={""}
            loading="lazy"
          />
        )}
        {post.media && isMp4 && (
          <video className="post__card-video" src={post.media} controls />
        )}
        {post.media && isYoutubeVideo && (
          <iframe
          style={{ width: "100%", aspectRatio: "16/9" }}
            className="post__card-youtube"
            src={post.media}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        <div className="post__card-footer">
          <BtnComment postId={post.id} commentsCount={post.commentsCount} />
          <BtnRepost postId={post.id}/>
          <BtnLike post={post} />
        </div>
      </div>
    </article>
    </>
  );
};

export default PostCard;
