import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import UserProfileThumbnail from "../../components/userProfile/UserProfileThumbnail";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import ButtonModal from "../../components/modal/ButtonModal";

const SideMenu = () => {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1280;

  return (
    <header className="sidemenu">
      <div className="sidemenu__container">
        <div className="sidemenu__wrapper">
          <NavLink className="sidemenu__logo" to="/home/posts">
            <img src="src/assets/images/logo/node_11748341.png" alt="" />
            {!isTablet && <h2 className="sidemenu__title">Social Network</h2>}
          </NavLink>
          <ul className="sidemenu__list">
            <MenuLink to="/home/posts" name="Home" icon="🏠" />
            <MenuLink to="/explore" name="Explore" icon="🔍" />
            <MenuLink to="/notifications" name="Notifications" icon="🔔" />
            <MenuLink to="/messages" name="Messages" icon="✉️" />
            <MenuLink to="/bookmarks" name="Bookmarks" icon="🔖" />
            <MenuLink to="/lists" name="Lists" icon="📚" />
            <MenuLink to="/profile" name="Profile" icon="👤" />
            <MenuLink to="/more" name="More" icon="⚙️" />
            <ButtonModal modalName={"Post"}>
              Poster
            </ButtonModal>
          </ul>
        </div>
        <UserProfileThumbnail />
      </div>
    </header>
  );
};

export default SideMenu;

type MenuLinkProps = {
  to: string;
  name: string;
  icon: string;
};

const MenuLink: FunctionComponent<MenuLinkProps> = ({ to, name, icon }) => {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1280;
  return (
    <li className="sidemenu__item">
      <NavLink to={to} className="sidemenu__link">
      {icon} {!isTablet && name}
      </NavLink>
    </li>
  );
};
