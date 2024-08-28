import { useEffect, useState, useCallback, type FunctionComponent, useRef } from "react";
import BtnLike from "../btn-like/BtnLike";
import { useGetUserByIdQuery } from "../../services/api/userApi";
import { getTimeSinceCreation } from "../../utils/functions/formatedDate";
import { Link, NavLink } from "react-router-dom";
import BtnRepost from "../btn-repost/BtnRepost";
import BtnComment from "../btn-comment/BtnComment";
import UserProfilCard from "../userProfile/UserProfilCard";
import { useGetPostByIdQuery } from "../../services/api/postApi";
import { PostFormProvider } from "./context/postFormContext";

export type PostProps = {
  originalPostId: string;
  origin?: string;
};

const RepostCard: FunctionComponent<PostProps> = ({ originalPostId, origin }) => {
    const { data: { data: postByOriginalId } = {} } = useGetPostByIdQuery(originalPostId ?? ""); console.log(postByOriginalId);
    const { data: { data: poster } = {} } = useGetUserByIdQuery(postByOriginalId?.userId ?? "");
    const posterId = postByOriginalId?.userId;
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

  useEffect(() => {
    console.log('origin', origin)
  }, [origin])
  
  if (!postByOriginalId) return null;
  const timeSinceCreation = getTimeSinceCreation(postByOriginalId.createdAt as string);
  const isWebp = postByOriginalId.media?.endsWith(".webp");
  const isMp4 = postByOriginalId.media?.endsWith(".mp4");
  const isYoutubeVideo = postByOriginalId.media?.includes("youtube.com");


  return (
    <>
      {origin !== "post-page" && (
        <NavLink to={`/home/posts/${postByOriginalId.id}`} className="post-card__link" />
      )}
      <article className="post-card">
        <div className="post-card__user"
          onMouseEnter={handleMouseEnterThumbnail}
          onMouseLeave={handleMouseLeaveThumbnail}
        >
          <Link to={`/profile/${posterId}`}>
            <img
              className="userprofile__picture"
              src={poster?.profilPicture ?? "/images/Default-user-picture.png"}
              alt="User Profile Thumbnail"
              loading="lazy"
            />
          </Link>
        </div>
        {showUserCard && (
          <UserProfilCard user={poster ?? null}
            cardRef={cardRef}
            onMouseEnter={handleMouseEnterCard}
            onMouseLeave={handleMouseLeaveCard}
          />
        )}
        <div className="post-card__wrapper">
          <Link to={`/profile/${posterId}`} className="post-card__header">
            <h3 className="post-card__header-username" 
              onMouseEnter={handleMouseEnterThumbnail}
              onMouseLeave={handleMouseLeaveThumbnail}
            >
              {poster?.username}
            </h3>
            <div className="post-card__header-wrapper">
              <p className="post-card__header-handle" 
                onMouseEnter={handleMouseEnterThumbnail}
                onMouseLeave={handleMouseLeaveThumbnail}
              >
                  {poster?.handle}
              </p>
              <span className="post-card__header-point"></span>
              <p className="post-card__date fs-15-400">{timeSinceCreation}</p>
            </div>
          </Link>
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
          <div className="post-card__footer">
            <BtnComment postId={postByOriginalId.id} commentsCount={postByOriginalId.commentsCount} />
            <PostFormProvider origin="modal-repost" originalPostId={originalPostId}>
              <BtnRepost postId={postByOriginalId.id} reposterCount={postByOriginalId.reposters?.length}/>
            </PostFormProvider>
            <BtnLike post={postByOriginalId} />
          </div>
        </div>
      </article>
    </>
  );
};

export default RepostCard;

