import { type FunctionComponent } from 'react';
import { CommentTypes } from '../../utils/types/comment.types';
import { useGetUserByIdQuery } from '../../services/api/userApi';
import { NavLink } from 'react-router-dom';
import BtnLike from '../btn-like/BtnLike';
import BtnRepost from '../btn-repost/BtnRepost';
import BtnComment from '../btn-comment/BtnComment';
import { PostFormProvider } from './context/postFormContext';
import {UserNameHoverDisplayCard, UserThumbnailHoverDisplayCard} from '../userProfile/UserHoverDisplayCard ';

interface CommentCardProps {
    comment: CommentTypes;
    origin: string;
}

const CommentCard: FunctionComponent<CommentCardProps> = ({comment, origin}) => {
    const commenterId = comment.userId;
    const commentsCount = comment.commentsCount;
    const { data: { data: commenter } = {} } = useGetUserByIdQuery(commenterId);
    const isWebp = comment.media?.endsWith(".webp");
    const isMp4 = comment.media?.endsWith(".mp4");
    const isYoutubeVideo = comment.media?.includes("youtube.com");
    
  return (
    <>
      {origin != "comment-page" && <NavLink to={`/home/comment/${comment.id}`} className="post-card__link"></NavLink>}
      <article className="post-card">
        <UserThumbnailHoverDisplayCard user={commenter} />
        <div className="post-card__wrapper">
          <UserNameHoverDisplayCard user={commenter} createdAt={comment.createdAt} />
          <p className="post-card__content">{comment.content}</p>
          {comment.media && isWebp && (
            <img className="post-card__img"
              src={comment.media}
              alt={""}
              loading="lazy"
            />
          )}
          {comment.media && isMp4 && (
            <video className="post-card__video" src={comment.media} controls />
          )}
          {comment.media && isYoutubeVideo && (
            <iframe
            style={{ width: "100%", aspectRatio: "16/9" }}
              className="post-card__youtube"
              src={comment.media}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          <div className="post-card__footer">
            <BtnComment 
              commentId={comment.id} 
              commentsCount={commentsCount}
            />
            <PostFormProvider origin='modal-repost-comment'> 
              <BtnRepost commentId={comment.id}/>
            </PostFormProvider>
            <BtnLike comment={comment} />
          </div>
        </div>
      </article>
    </>
  );
};

export default CommentCard;