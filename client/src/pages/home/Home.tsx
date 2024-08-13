import TabList from "../../components/tabList/TabList";
import { Routes, Route } from "react-router-dom";
import AddPost from "../../components/post/AddPost";
import PostList from "../../components/post/PostsList";

const Home = () => {
  return (
    <div className="home">
      <TabList
        links={[
          { name: "Pour vous", to: "/home/posts" },
          { name: "Abonnements", to: "/home/abonnements" },
        ]}
      />
      <AddPost origin="page" />
      <Routes>
        <Route path="/posts" element={<PostList />} />
        <Route path="/abonnements" element={<h2>Abonnements</h2>} />
        <Route path="/coding-lab" element={<h2>CodingLab</h2>} />
      </Routes>
    </div>
  );
};

export default Home;
