import { Routes, Route } from "react-router-dom";
import PostList from "../../components/Display/post/PostsList";
import TabList from "../../components/Base/tabList/TabList";
import { PostFormProvider } from "../../components/Form/context/postFormContext";
import AddPost from "../../components/Form/AddPost";

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
