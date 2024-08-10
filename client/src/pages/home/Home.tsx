import TabList from "../../components/tabList/TabList";
import { Routes, Route } from "react-router-dom";
import FeedList from "../../layouts/feed/FeedList";
import AddPost from "../../components/post/AddPost";

const Home = () => {
  return (
    <div className="home">
      <TabList
        links={[
          { name: "Pour vous", to: "/home/feed" },
          { name: "Abonnements", to: "/home/abonnements" },
        ]}
      />
      <AddPost />
      <Routes>
        <Route path="/feed" element={<FeedList />} />
        <Route path="/abonnements" element={<h2>Abonnements</h2>} />
        <Route path="/coding-lab" element={<h2>CodingLab</h2>} />
      </Routes>
    </div>
  );
};

export default Home;
