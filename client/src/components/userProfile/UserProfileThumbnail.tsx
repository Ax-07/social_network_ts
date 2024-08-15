import { useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { RootState } from "../../services/stores";
import { NavLink } from "react-router-dom";
import { logout } from "../../services/auth/authSlice";
import { useState } from "react";

export const UserPicture = () => {
  const user = useSelector((state: RootState) => state.auth?.user);
  return (
    <NavLink to={`/profile/${user?.id}`}>
      <img
        className="userprofile__picture"
        src={
          user?.profilPicture
            ? user.profilPicture
            : "/images/Default-user-picture.png"
        }
        alt="User Profile Thumbnail"
        loading="lazy"
      />
    </NavLink>
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
        <img className="userprofile__picture"
          src={ user?.profilPicture ? user.profilPicture : "/images/Default-user-picture.png" }
          alt="User Profile Thumbnail"
          loading="lazy"
        />
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
