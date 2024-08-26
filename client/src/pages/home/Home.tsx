import { Routes, Route } from "react-router-dom";
import PostList from "../../components/post/PostsList";
import TabList from "../../components/tabList/TabList";
import { PostFormProvider } from "../../components/post/context/postFormContext";
import AddPost from "../../components/post/AddPost";

const Home = () => {
  return (
    <section className="home">
      <TabList
        links={[
          { name: "Pour vous", to: "/home/posts" },
          { name: "Abonnements", to: "/home/abonnements" },
        ]}
      />
      <PostFormProvider origin="page-home">
        <AddPost origin="page-home" />
      </PostFormProvider>
      <Routes>
        <Route path="/posts" element={<PostList />} />
        <Route path="/abonnements" element={<h2>Abonnements</h2>} />
        <Route path="/coding-lab" element={<h2>CodingLab</h2>} />
      </Routes>
    </section>
  );
};

export default Home;
