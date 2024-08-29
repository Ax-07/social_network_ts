import { useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { RootState } from "../../services/stores";
import { NavLink } from "react-router-dom";
import { logout } from "../../services/auth/authSlice";
import { FunctionComponent, useState } from "react";
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
    <NavLink to={`/profile/${user.id}`}>
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
            <span className="fs-16-700">...</span>
          </>
        )}
      </div>
      
        {isOpen && (
        <>
        <div className="userprofile__thumbnail-menu">
          <NavLink to={`/profile/${user?.id}`} onClick={()=> setIsOpen(false)} className="fs-16-700">
            Profile
          </NavLink>
          <a href="/" onClick={handleLogout} className="fs-16-700">
            Se deconnecter de {user?.handle}
          </a>
          <span className="userprofile__thumbnail-menu-square"></span>
        </div>
        <div className="userprofile__thumbnail-menu-overlay" onClick={() => setIsOpen(false)}></div>
        </>
      )}
    </>
  );
};

export default UserProfileThumbnail;
