import { useEffect, useState, useCallback, type FunctionComponent, useRef } from "react";
import BtnLike from "../btn-like/BtnLike";
import { useGetUserByIdQuery } from "../../services/api/userApi";
import { getTimeSinceCreation } from "../../utils/functions/formatedDate";
import { Link, NavLink } from "react-router-dom";
import { PostTypes } from "../../utils/types/post.types";
import BtnRepost from "../btn-repost/BtnRepost";
import BtnComment from "../btn-comment/BtnComment";
import UserProfilCard from "../userProfile/UserProfilCard";
import { PostFormProvider } from "./context/postFormContext";
import RepostCard from "./RepostCard";

export type PostProps = {
  post: PostTypes;
  origin?: string;
};

const PostCard: FunctionComponent<PostProps> = ({ post, origin }) => {
  const posterId = post.userId;
  const { data: { data: poster } = {} } = useGetUserByIdQuery(posterId);
  const timeSinceCreation = getTimeSinceCreation(post?.createdAt as string);
  const isWebp = post?.media?.endsWith(".webp");
  const isMp4 = post?.media?.endsWith(".mp4");
  const isYoutubeVideo = post?.media?.includes("youtube.com");
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
      {origin !== "post-page" && (
        <NavLink to={`/home/posts/${post.id}`} className="post-card__link" />
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
              <BtnRepost postId={post.id}/>
            </PostFormProvider>
            <BtnLike post={post} />
          </div>
        </div>
      </article>
    </>
  );
};

export default PostCard;

