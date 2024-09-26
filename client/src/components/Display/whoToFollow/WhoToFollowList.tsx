import { useSelector } from "react-redux";
import { useGetWhoToFollowQuery } from "../../../services/api/followApi";
import { RootState } from "../../../services/stores";
import WhoToFollowCard from "./WhoToFollowCard";

const WhoToFollowList = () => {
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
  const { data: { data: usersToFollow } = {} } = useGetWhoToFollowQuery(userId ?? "");
  console.log("usersToFollow", usersToFollow);

  return (
    <>
      {usersToFollow && usersToFollow.length > 0 && (
        <div className="whoToFollow">
          <h2 className="whoToFollow__title">À suivre</h2>
          <ul className="whoToFollow__list">
            {usersToFollow.map((userToFollow) => (
              <li key={userToFollow.id} className="whoToFollow__item">
                <WhoToFollowCard userToFollow={userToFollow} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default WhoToFollowList;
