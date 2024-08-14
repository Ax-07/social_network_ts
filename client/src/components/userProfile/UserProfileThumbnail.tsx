import { useSelector } from "react-redux";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { RootState } from "../../services/stores";
import { NavLink } from "react-router-dom";

export const UserPicture = () => {
  const userPicture = useSelector((state: RootState) => state.auth.user?.profilPicture);
  return (
    <NavLink to="/profile">
    <img 
      className="userprofile__picture" 
      src={userPicture ? userPicture : "/images/Default-user-picture.png"} 
      alt="User Profile Thumbnail" 
      loading="lazy"
    />
    </NavLink>
  );
}


const UserProfileThumbnail = () => {
  const user = useSelector((state: RootState) => state.auth.user); console.log(user);
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1280;
  return (
    <div className="userprofile__thumbnail">
      <UserPicture />
      {!isTablet && (
        <>
          <div className="userprofile__thumbnail-info">
            <h3 className="fs-15-700">{user?.username}</h3>
            <p className="fs-15-600">{user?.email}</p>
          </div>
          <span className="fs-16-700">...</span>
        </>
      )}
    </div>
  );
};

export default UserProfileThumbnail;
