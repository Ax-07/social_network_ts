import type { FunctionComponent } from 'react';
import { CommentTypes } from '../../utils/types/comment.types';
import { useGetUserByIdQuery } from '../../services/api/userApi';
import { getTimeSinceCreation } from '../../utils/functions/formatedDate';
import { Link, NavLink } from 'react-router-dom';
import ButtonModal from '../modal/ButtonModal';
import BtnLike from '../btn-like/BtnLike';

interface CommentCardProps {
    comment: CommentTypes;
    origin: string;
}

const CommentCard: FunctionComponent<CommentCardProps> = ({comment, origin}) => {
    const commenterId = comment.userId;
    const commenter = useGetUserByIdQuery(commenterId);
    const isWebp = comment.media?.endsWith(".webp");
    const isMp4 = comment.media?.endsWith(".mp4");
    const isYoutubeVideo = comment.media?.includes("youtube.com");
    const timeSinceCreation = getTimeSinceCreation(comment.createdAt as string);
  return (
    <>
      {origin != "comment-page" && <NavLink to={`/home/comment/${comment.id}`} className="post__card-link"></NavLink>}
      <article className="post__card">
      <div className="post__card-user">
        <Link to={`/profile/${commenterId}`}>
        <img
          className="userprofile__picture"
          src={commenter.data?.profilPicture ? commenter.data?.profilPicture : "/images/Default-user-picture.png"}
          alt="User Profile Thumbnail"
          loading="lazy"
        />
        </Link>
      </div>
      <div className="post__card-wrapper">
        <div className="post__card-header">
          <h3 className="post__card-username fs-16-700">{commenter.data?.username}</h3>
          <p className="post__card-handle fs-15-400">{commenter.data?.handle}</p>
          <p className="post__card-date fs-15-400">{timeSinceCreation}</p>
        </div>
        <p className="post__card-content">{comment.content}</p>
        {comment.media && isWebp && (
          <img
            className="post__card-img"
            src={comment.media}
            alt={""}
            loading="lazy"
          />
        )}
        {comment.media && isMp4 && (
          <video className="post__card-video" src={comment.media} controls />
        )}
        {comment.media && isYoutubeVideo && (
          <iframe
          style={{ width: "100%", aspectRatio: "16/9" }}
            className="post__card-youtube"
            src={comment.media}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        <div className="post__card-footer">
          <ButtonModal modalName="modal-comment-comment" commentId={comment.id}>
            <img src="/src/assets/icons/faMessage.svg" alt="icon comment" />
          </ButtonModal>
          <div>{comment.commentsCount}</div>
          <BtnLike comment={comment} />
        </div>
      </div>
    </article>
    </>
  );
};

export default CommentCard;