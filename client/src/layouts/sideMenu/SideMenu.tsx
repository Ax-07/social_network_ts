import { FunctionComponent, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserProfileThumbnail from "../../components/userProfile/UserProfileThumbnail";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import ButtonModal from "../../components/modal/ButtonModal";
import { useSelector } from "react-redux";
import { AuthState } from "../../services/auth/authSlice";
import useNotifications from "../../pages/notifications/hooks/useNotifications";

const SideMenu = () => {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1280;
  const isUserConnected = useSelector(
    (state: { auth: AuthState }) => state.auth.isAuthenticated
  );
  const userId = useSelector((state: { auth: AuthState }) => state.auth.user?.id);

  return (
    <header className="sidemenu">
      <div className="sidemenu__container">
        <div className="sidemenu__wrapper">
          <NavLink className="sidemenu__logo" to="/home">
            <img src="/src/assets/images/logo/node_11748341.png" alt="" />
            {!isTablet && <h2 className="sidemenu__title">Social Network</h2>}
          </NavLink>
          <ul className="sidemenu__list">
            <MenuLink to="/home" name="Home" icon="/src/assets/icons/faHome.svg" />
            <MenuLink to="/explore" name="Explore" icon="/src/assets/icons/faSearch.svg" />
            <MenuLink to="/notifications" name="Notifications" icon="/src/assets/icons/faBell.svg" userId={userId}/>
            <MenuLink to="/messages" name="Messages" icon="/src/assets/icons/faEnvelope.svg" />
            <MenuLink to="/bookmarks" name="Bookmarks" icon="/src/assets/icons/faBookmark.svg" />
            <MenuLink to="/lists" name="Lists" icon="/src/assets/icons/faListDots.svg" />
            <MenuLink to={`/profile/${userId}`} name="Profile" icon="/src/assets/icons/faUser.svg" />
            <MenuLink to="/more" name="More" icon="/src/assets/icons/faEllipsis.svg" />
            <ButtonModal modalName={"modal-addPost"} className="btn__post btn__post-modal">
              {isTablet ? <img src="/src/assets/icons/faPenToSquare.svg" alt="icon pen to square"/> : "Poster"}
            </ButtonModal>
          </ul>
        </div>
        {isUserConnected ? (
          <UserProfileThumbnail />
        ) : (
          <MenuLink to="/auth" name="Login" icon="🔑" />
        )}
      </div>
    </header>
  );
};

export default SideMenu;

type MenuLinkProps = {
  to: string;
  name: string;
  icon: string;
  userId?: string;
};

const MenuLink: FunctionComponent<MenuLinkProps> = ({ to, name, icon, userId }) => {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1280;
  const { notifications } = useNotifications(userId as string);

  const [isNotification, setIsNotification ] = useState(false);

  useEffect(() => {
    if(notifications.length > 0) {
      setIsNotification(true);
    } else {
      setIsNotification(false);
    }
  }, [notifications]);

  const resetNotifications = () => {
    setIsNotification(false);
  };

  return (
    <li className="sidemenu__item" onClick={resetNotifications}>
      <NavLink to={to} className="sidemenu__link">
        <img src={icon} alt={`icon ${name}`} />
        {isNotification && userId &&
        <span className="sidemenu__link-notifications">
          <p>{notifications.length}</p>
        </span>}
        {!isTablet && name}
      </NavLink>
    </li>
  );
};
