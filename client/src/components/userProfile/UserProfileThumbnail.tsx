import { useWindowSize } from "../../utils/hooks/useWindowSize";

export const UserPicture = () => {
  return  <img className="userprofile__picture" src="https://via.placeholder.com/40" alt="User Profile Thumbnail" loading="lazy"/>;
}

const UserProfileThumbnail = () => {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1280;
  return (
    <div className="userprofile__thumbnail">
      <UserPicture />
      {!isTablet && (
        <>
          <div className="userprofile__thumbnail-info">
            <h3 className="fs-15-700">Username</h3>
            <p className="fs-15-600">@email</p>
          </div>
          <span className="fs-16-700">...</span>
        </>
      )}
    </div>
  );
};

export default UserProfileThumbnail;
