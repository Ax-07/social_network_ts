import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import UserProfileThumbnail from "../../components/userProfile/UserProfileThumbnail";

const SideMenu = () => {
  return (
    <div className="sidemenu background-blur">
      <div className="sidemenu__wrapper">
        <h2 className="sidemenu__title">Social Network</h2>
        <ul className="sidemenu__list">
          <MenuLink to="/home" name="Home" icon="🏠" />
          <MenuLink to="/explore" name="Explore" icon="🔍" />
          <MenuLink to="/notifications" name="Notifications" icon="🔔" />
          <MenuLink to="/messages" name="Messages" icon="✉️" />
          <MenuLink to="/bookmarks" name="Bookmarks" icon="🔖" />
          <MenuLink to="/lists" name="Lists" icon="📚" />
          <MenuLink to="/profile" name="Profile" icon="👤" />
          <MenuLink to="/more" name="More" icon="⚙️" />
        </ul>
      </div>
      <UserProfileThumbnail />
    </div>
  );
};

export default SideMenu;

type MenuLinkProps = {
  to: string;
  name: string;
  icon: string;
};

const MenuLink: FunctionComponent<MenuLinkProps> = ({ to, name, icon }) => {
  return (
    <li className="sidemenu__item">
      {icon}
      <NavLink to={to} className="sidemenu__link">
        {name}
      </NavLink>
    </li>
  );
};
