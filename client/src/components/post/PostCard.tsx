import type { FunctionComponent } from "react";
import type { Post } from "../../services/api/postApi";
import BtnLike from "../btn-like/BtnLike";
import { useGetUserByIdQuery } from "../../services/api/userApi";
import { getTimeSinceCreation } from "../../utils/functions/formatedDate";
import { NavLink } from "react-router-dom";

export type PostProps = {
  post: Post;
};

const PostCard: FunctionComponent<PostProps> = ({ post }) => {
  const posterId = post.userId;
  const poster = useGetUserByIdQuery(posterId);
  const isWebp = post.media?.endsWith(".webp");
  const isMp4 = post.media?.endsWith(".mp4");
  const isYoutubeVideo = post.media?.includes("youtube.com");
  const timeSinceCreation = getTimeSinceCreation(post.createdAt as string);

  const embedYoutube = (url: string) => {
    console.log("url: ", url);
    const embedVideo = url.replace("watch?v=", "embed/").split('&')[0]; console.log("embedVideo: ", embedVideo);
    return embedVideo;
  }

  return (
    <article className="post__card">
      <div className="post__card-user">
        <NavLink to={`/profile/${posterId}`}>
        <img
          className="userprofile__picture"
          src={poster.data?.profilPicture ? poster.data?.profilPicture : "/images/Default-user-picture.png"}
          alt="User Profile Thumbnail"
          loading="lazy"
        />
        </NavLink>
      </div>
      <div className="post__card-wrapper">
        <div className="post__card-header">
          <h3 className="post__card-username fs-16-700">{poster.data?.username}</h3>
          <p className="post__card-handle fs-15-400">{poster.data?.handle}</p>
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
            src={embedYoutube(post.media)}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        <BtnLike post={post} />
      </div>
    </article>
  );
};

export default PostCard;
