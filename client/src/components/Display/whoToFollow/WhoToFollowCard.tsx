import type { FunctionComponent } from "react";
import MemoizedBtnFollow from "../../Actions/btn-follow/BtnFollow";
import { useGetUserByIdQuery } from "../../../services/api/userApi";
import {
  UserNameHoverDisplayCard,
  UserThumbnailHoverDisplayCard,
} from "../../userProfile/UserHoverDisplayCard ";

interface UserToFollowCardProps {
  userToFollow: {
    id: string;
    username: string;
    profilPicture: string;
  };
}

const WhoToFollowCard: FunctionComponent<UserToFollowCardProps> = ({
  userToFollow,
}) => {
  const { data: { data: user } = {} } = useGetUserByIdQuery(userToFollow.id);
  return (
    <article className="post-card userToFollow" aria-labelledby={`user-to-follow-${userToFollow.id}`}>
      <UserThumbnailHoverDisplayCard user={user} />
      <div className="userToFollow__info">
        <UserNameHoverDisplayCard user={user} flexDirection="column"/>
        <p className="fs-15-600">{user?.bio ?? "hello world"}</p>
      </div>
      <MemoizedBtnFollow userToFollowId={userToFollow.id} />
    </article>
  );
};

export default WhoToFollowCard;
