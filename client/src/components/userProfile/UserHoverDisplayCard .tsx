import { type FunctionComponent } from "react";
import UserProfilCard from "./UserProfilCard";
import { ProfilPicture } from "./UserProfileThumbnail";
import { User } from "../../utils/types/user.types";
import { Link } from "react-router-dom";
import { getTimeSinceCreation } from "../../utils/functions/formatedDate";
import { useHoverDisplayCard } from "./hooks/useHoverDisplayCard";

interface UserHoverDisplayCard {
  user?: User | null;
  createdAt?: string;
  flexDirection?: string;
}

const UserThumbnailHoverDisplayCard: FunctionComponent<UserHoverDisplayCard> = ({ user }) => {
    const {
        showUserCard,
        handleMouseEnterThumbnail,
        handleMouseLeaveThumbnail,
        handleMouseEnterCard,
        handleMouseLeaveCard,
        cardRef
      } = useHoverDisplayCard();

  return (
    <>
      <div
        className="post-card__user"
        onMouseEnter={handleMouseEnterThumbnail}
        onMouseLeave={handleMouseLeaveThumbnail}
        aria-label={`Voir plus d'informations sur l'utilisateur ${user?.username}`}
      >
        <ProfilPicture user={user} />
      </div>
      {showUserCard && (
        <UserProfilCard
          user={user ?? null}
          cardRef={cardRef}
          onMouseEnter={handleMouseEnterCard}
          onMouseLeave={handleMouseLeaveCard}
        />
      )}
    </>
  );
};

const UserNameHoverDisplayCard: FunctionComponent<UserHoverDisplayCard> = ({ user, createdAt, flexDirection }) => {
  const timeSinceCreation = createdAt && getTimeSinceCreation(createdAt as string);
    const {
        showUserCard,
        handleMouseEnterThumbnail,
        handleMouseLeaveThumbnail,
        handleMouseEnterCard,
        handleMouseLeaveCard,
        cardRef
      } = useHoverDisplayCard();

    return (
        <>
        <Link to={`/profile/${user?.id}`} className={flexDirection ? `post-card__header--${flexDirection}` : "post-card__header"} aria-label={`Voir le profil de ${user?.username}`}>
            <h2 className="post-card__header-username" 
              onMouseEnter={handleMouseEnterThumbnail}
              onMouseLeave={handleMouseLeaveThumbnail}
              aria-label={`Voir plus d'informations sur l'utilisateur ${user?.username}`}
            >
              {user?.username}
            </h2>
            <div className="post-card__header-wrapper">
              <p className="post-card__header-handle" 
                onMouseEnter={handleMouseEnterThumbnail}
                onMouseLeave={handleMouseLeaveThumbnail}
                aria-label={`Voir plus d'informations sur l'utilisateur ${user?.username}`}
              >
                  {user?.handle}
              </p>
              {timeSinceCreation && <span className="post-card__header-point"></span>}
              {timeSinceCreation && <p className="post-card__date fs-15-400">{timeSinceCreation}</p>}
            </div>
          </Link>
           {showUserCard && (
            <UserProfilCard
              user={user ?? null}
              cardRef={cardRef}
              onMouseEnter={handleMouseEnterCard}
              onMouseLeave={handleMouseLeaveCard}
            />
          )}
        </>
    )
}

export { UserThumbnailHoverDisplayCard, UserNameHoverDisplayCard };
