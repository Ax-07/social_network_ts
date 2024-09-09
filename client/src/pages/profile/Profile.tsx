import TabList from "../../components/Base/tabList/TabList";
import { useGetFollowersNamesQuery, useGetUserByIdQuery } from "../../services/api/userApi";
import { useParams } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { getFormattedDate } from "../../utils/functions/formatedDate";
import { useEffect, useState } from "react";
import { RootState } from "../../services/stores";
import { useSelector } from "react-redux";

const Profile = () => {
  const params = useParams<{ id: string }>();
  const { data: { data: user } = {} } = useGetUserByIdQuery(params.id || "");
  const { data: followersData } = useGetFollowersNamesQuery(user?.id ?? '');
  const [filteredFollowersNames, setFilteredFollowersNames] = useState<string[]>([]);
  const userName = useSelector((state: RootState) => state?.auth?.user?.username);

  useEffect(() => {
      if (followersData?.data?.followersNames && userName) {
          const filteredNames = followersData.data.followersNames.filter(
              (followerName) => followerName !== userName
          );
          setFilteredFollowersNames(filteredNames);
      }
  }, [followersData, userName]);
  return (
    <div className="profile">
      <header className="profile__header">
        <span className="btn-back">
          <img src="/src/assets/icons/faArrowLeft.svg" alt="arrow left" />
        </span>
        <div className="profile__header-wrapper">
          <h2 className="fs-20-700">{user?.username}</h2>
          <p className="fs-15-600">{user?.email}</p>
        </div>
      </header>
      <div className="profile__banner">
        {user?.coverPicture && <img src="" alt="Banner" />}
      </div>
      <div className="profile__info">
        <div className="profile__info-header">
            <img className="profile__info-picture"
              src={user?.profilPicture || "/images/Default-user-picture.png"}
              alt="Avatar"
            />
            <button className="btn">Configurer le profil</button>
        </div>
        <div className="profile__info-body">
          <h3 className="fs-20-700">{user?.username}</h3>
          <p className="fs-15-600">{user?.email}</p>
          <p className="fs-15-600">{user?.bio}</p>
        </div>
        <div className="profile__info-body-row">
          <h3 className="fs-20-700">{user?.birthdate?.toString()}</h3>
          <p className="fs-15-600">Membre depuis {getFormattedDate(user?.createdAt?.toString() ?? '')}</p>
        </div>
        <div className="profile__info-follow">
            <div className="profile__info-follow-row">
                <h3 className="fs-20-700">{user?.followings?.length} Abonnements</h3>
            </div>
            <div className="profile__info-follow-row">
                <h3 className="fs-20-700">{user?.followers?.length} Abonnés</h3>
            </div>
            <p className="fs-15-600">Suivi par {
              filteredFollowersNames && filteredFollowersNames?.map((followerName, index) => (
                <span key={index}>{followerName}{index === filteredFollowersNames.length - 1 ? ' ' : ', '}</span>
              ))
              } que vous suivez</p>
        </div>

      </div>
      <TabList 
        links={[
            {name: "Posts", to: `/profile/${user?.id}`},
            {name: "Reponses", to: `/profile/${user?.id}/with_replies`},
            {name: "Tweets marquants", to: `/profile/${user?.id}/highlights`},
            {name: "Articles", to: `/profile/${user?.id}/articles`},
            {name:"Medias", to: `/profile/${user?.id}/medias`},
            {name:"Likes", to: `/profile/${user?.id}/likes`}
        ]}/>
        <Routes>
            <Route path="/" element={<h2>Posts</h2>} />
            <Route path="/with_replies" element={<h2>Reponses</h2>} />
            <Route path="/highlights" element={<h2>Tweets marquants</h2>} />
            <Route path="/articles" element={<h2>Articles</h2>} />
            <Route path="/medias" element={<h2>Medias</h2>} />
            <Route path="/likes" element={<h2>Likes</h2>} />
        </Routes>
        <section>
            <h2>Who to follow</h2>
            <p>Note à moi même, fait ca à la fin</p>
        </section>
    </div>
  );
};

export default Profile;
