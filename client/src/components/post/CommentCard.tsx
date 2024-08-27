import { useCallback, useEffect, useRef, useState, type FunctionComponent } from 'react';
import { CommentTypes } from '../../utils/types/comment.types';
import { useGetUserByIdQuery } from '../../services/api/userApi';
import { getTimeSinceCreation } from '../../utils/functions/formatedDate';
import { Link, NavLink } from 'react-router-dom';
import BtnLike from '../btn-like/BtnLike';
import BtnRepost from '../btn-repost/BtnRepost';
import BtnComment from '../btn-comment/BtnComment';
import UserProfilCard from '../userProfile/UserProfilCard';
import { PostFormProvider } from './context/postFormContext';

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
    const timeSinceCreation = getTimeSinceCreation(comment.createdAt as string);
    const [isHoveringThumbnail, setIsHoveringThumbnail] = useState(false);
    const [isHoveringCard, setIsHoveringCard] = useState(false);
    const [showUserCard, setShowUserCard] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const keepUserProfileCardInBounds  = useCallback(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
  
        // Vérifier et ajuster le dépassement à droite
        if (rect.right > window.innerWidth) {
          cardRef.current.style.position = "fixed";
          cardRef.current.style.left = "auto";
          cardRef.current.style.right = "20px";
        } else if (rect.left < 0) {
          // Ajuster si ça dépasse à gauche
          cardRef.current.style.position = "fixed";
          cardRef.current.style.left = "20px";
          cardRef.current.style.right = "auto";
        }
  
        // Vérifier et ajuster le dépassement en bas
        if (rect.bottom > window.innerHeight) {
          cardRef.current.style.position = "fixed";
          cardRef.current.style.top = "auto";
          cardRef.current.style.bottom = "20px";
          cardRef.current.style.left = "70px";
        }
      }
    }, []);
    useEffect(() => {
      if (showUserCard) {
        keepUserProfileCardInBounds ();
      }
    }, [showUserCard, keepUserProfileCardInBounds ]);
  
    const handleMouseEnterThumbnail = useCallback(() => {
      setIsHoveringThumbnail(true);
    }, []);
    const handleMouseLeaveThumbnail = useCallback(() => {
      setIsHoveringThumbnail(false);
    }, []);
    const handleMouseEnterCard = useCallback(() => {
      setIsHoveringCard(true);
    }, []);
    const handleMouseLeaveCard = useCallback(() => {
      setIsHoveringCard(false);
    }, []);
    useEffect(() => {
      let showTimeout: NodeJS.Timeout;
      let hideTimeout: NodeJS.Timeout;
  
      if (isHoveringThumbnail || isHoveringCard) {
        showTimeout = setTimeout(() => setShowUserCard(true), 500); // Délai avant d'afficher la carte utilisateur
      } else {
        hideTimeout = setTimeout(() => setShowUserCard(false), 300); // Délai avant de masquer la carte utilisateur
      }
  
      return () => {
        clearTimeout(showTimeout); // Efface le timeout si l'effet est ré-exécuté
        clearTimeout(hideTimeout); // Efface le timeout si l'effet est ré-exécuté
      };
    }, [isHoveringThumbnail, isHoveringCard]);
    
  return (
    <>
      {origin != "comment-page" && <NavLink to={`/home/comment/${comment.id}`} className="post-card__link"></NavLink>}
      <article className="post-card">
      <div className="post-card__user"
          onMouseEnter={handleMouseEnterThumbnail}
          onMouseLeave={handleMouseLeaveThumbnail}
        >
        <Link to={`/profile/${commenterId}`}>
        <img
          className="userprofile__picture"
          src={commenter?.profilPicture ? commenter?.profilPicture : "/images/Default-user-picture.png"}
          alt="User Profile Thumbnail"
          loading="lazy"
        />
        </Link>
      </div>
      {showUserCard && (
          <UserProfilCard user={commenter ?? null}
            cardRef={cardRef}
            onMouseEnter={handleMouseEnterCard}
            onMouseLeave={handleMouseLeaveCard}
          />
        )}
      <div className="post-card__wrapper">
      <Link to={`/profile/${commenterId}`} className="post-card__header">
            <h3 className="post-card__header-username" 
              onMouseEnter={handleMouseEnterThumbnail}
              onMouseLeave={handleMouseLeaveThumbnail}
            >
              {commenter?.username}
            </h3>
            <div className="post-card__header-wrapper">
              <p className="post-card__header-handle" 
                onMouseEnter={handleMouseEnterThumbnail}
                onMouseLeave={handleMouseLeaveThumbnail}
              >
                  {commenter?.handle}
              </p>
              <span className="post-card__header-point"></span>
              <p className="post-card__date fs-15-400">{timeSinceCreation}</p>
            </div>
          </Link>
        <p className="post-card__content">{comment.content}</p>
        {comment.media && isWebp && (
          <img
            className="post-card__img"
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