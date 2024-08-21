import { Routes, Route } from "react-router-dom";
import PostList from "../../components/post/PostsList";
import PostPage from "../post/PostPage";
import CommentPage from "../post/CommentPage";

const Home = () => {
  return (
    <section className="home">
      <Routes>
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/comment/:id" element={<CommentPage />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/abonnements" element={<h2>Abonnements</h2>} />
        <Route path="/coding-lab" element={<h2>CodingLab</h2>} />
      </Routes>
    </section>
  );
};

export default Home;
