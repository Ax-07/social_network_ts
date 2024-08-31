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
          { name: "Pour vous", to: "/home", end: true },
          { name: "Abonnements", to: "/home/abonnements", end: false },
        ]}
      />
      <PostFormProvider origin="page-home">
        <AddPost origin="page-home" />
      </PostFormProvider>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/abonnements" element={<h2>Abonnements</h2>} />
      </Routes>
    </section>
  );
};

export default Home;
