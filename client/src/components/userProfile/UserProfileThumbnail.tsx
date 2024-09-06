import { useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { RootState } from "../../services/stores";
import { NavLink } from "react-router-dom";
import { logout } from "../../services/auth/authSlice";
import { FunctionComponent, useEffect, useState } from "react";
import { User } from "../../utils/types/user.types";

interface IProfilPicture {
  user?: User | null;
  withLink?: boolean;
}
/**
 * Composant ProfilPicture
 * @param {IProfilPicture} props - Les propriétés du composant.
 * @param {User | null} props.user - L'utilisateur dont la photo de profil doit être affichée. Peut être null ou undefined.
 * @param {boolean} [props.withLink=true] - Indique si la photo de profil doit être cliquable avec un lien vers le profil de l'utilisateur.
 * @returns {JSX.Element}
 * @description Affiche la photo de profil de l'utilisateur avec ou sans lien vers son profil.
 * 
 * @see {@link User} pour les informations sur l'utilisateur.
 * 
 * @example
 * // Utilisation avec lien vers le profil (par défaut)
 * <ProfilPicture user={user} withLink={true} />
 * 
 * @example
 * // Utilisation sans lien vers le profil
 * <ProfilPicture user={user} withLink={false} />
 */
export const ProfilPicture: FunctionComponent<IProfilPicture> = ({ user, withLink = true }) => {
  const profileImage = (
    <img
      className="userprofile__picture"
      src={user?.profilPicture ? user.profilPicture : "/images/Default-user-picture.png"}
      alt="User Profile Thumbnail"
      loading="lazy"
    />
  );

  return withLink && user?.id ? (
    <NavLink to={`/profile/${user.id}`} aria-label={`Voir le profil de ${user.username}`}>
      {profileImage}
    </NavLink>
  ) : (
    profileImage
  );
};

const UserProfileThumbnail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1280;

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <div className="userprofile__thumbnail" onClick={() => setIsOpen(!isOpen)}>
        <ProfilPicture user={user} withLink={false}/>
        {!isTablet && (
          <>
            <div className="userprofile__thumbnail-info">
              <h3 className="fs-15-700">{user?.username}</h3>
              <p className="fs-15-600">{user?.handle}</p>
            </div>
            <span className="fs-16-700" aria-hidden="true">...</span>
          </>
        )}
      </div>
      
      {isOpen && (
        <>
          {/* Menu déroulant avec rôle "menu" et "menuitem" */}
          <nav className="userprofile__thumbnail-menu" role="menu">
            <ul>
              <li className="userprofile__thumbnail-menu_item" role="menuitem">
                <NavLink 
                  to={`/profile/${user?.id}`} 
                  onClick={() => setIsOpen(false)} 
                  className="fs-16-700"
                  aria-label="Voir le profil"
                >
                  Profil
                </NavLink>
              </li>
              <li className="userprofile__thumbnail-menu_item" role="menuitem">
                <a 
                  href="/" 
                  onClick={handleLogout} 
                  className="fs-16-700"
                  aria-label={`Se déconnecter de ${user?.handle}`}
                >
                  Se déconnecter de {user?.handle}
                </a>
              </li>
            </ul>
            <span className="userprofile__thumbnail-menu-square" aria-hidden="true"></span>
          </nav>

          {/* Overlay cliquable pour fermer le menu */}
          <div 
            className="userprofile__thumbnail-menu-overlay" 
            onClick={() => setIsOpen(false)} 
            aria-hidden="true"
          ></div>
        </>
      )}
    </>
  );
};

export default UserProfileThumbnail;
