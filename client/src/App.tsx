import { Routes, Route, Navigate  } from "react-router-dom";
import SideMenu from "./layouts/sideMenu/SideMenu";
import SideColumn from "./layouts/sideColumn/SideColumn";
import { useWindowSize } from "./utils/hooks/useWindowSize";
import { useEffect } from "react";
import { useGoogleRefreshTokenMutation } from "./services/auth/googleAuthApi";
import { useSelector } from "react-redux";
import { RootState } from "./services/stores";
import Pages from "./pages";
import Modals from "./components/modal/Modals";
import PostPage from "./pages/post/PostPage";
import CommentPage from "./pages/post/CommentPage";

function App() {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1020;
  const refreshToken = useSelector((state: RootState) => state.auth?.refreshToken);
  const isAuth = useSelector((state: RootState) => state.auth?.isAuthenticated);
  const [ googleRefreshToken ] = useGoogleRefreshTokenMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuth || !refreshToken) return;
      googleRefreshToken({refreshToken: refreshToken});
    }, 1000 * 60 * 15); // 15 minutes
    return () => clearInterval(interval);
  }, [isAuth, refreshToken, googleRefreshToken]);

  return (
    <div className="app">
      <picture className="picture-background">
        <source srcSet="/images/app-background/mobile-unsplash_eNoeWZkO7Zc.webp" media="(max-width: 600px)" />
        <source
          srcSet="/images/app-background/tablet-unsplash_eNoeWZkO7Zc.webp"
          media="(min-width: 601px) and (max-width: 1024px)"
        />
        <source srcSet="/images/app-background/desktop-unsplash_eNoeWZkO7Zc.webp" media="(min-width: 1025px)" />
        <img src="/images/app-background/mobile-image.webp" alt="image de fond de l'application" loading="lazy" />
      </picture>
      <SideMenu />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/home/posts" />} />
          <Route path="/auth" element={<Pages.AuthPage />} />
          <Route path="/home/*" element={<Pages.Home />} />
          <Route path="/home/posts/:id" element={<PostPage />} />
          <Route path="/home/comment/:id" element={<CommentPage />} />
          <Route path="/explore" element={<Pages.Explore />} />
          <Route path="/notifications/*" element={<Pages.Notifications />} />
          <Route path="/messages" element={<Pages.Messages />} />
          <Route path="/bookmarks" element={<Pages.BooKmarks />} />
          <Route path="/lists" element={<Pages.Lists />} />
          <Route path="/profile/:id/*" element={<Pages.Profile />} />
          <Route path="/more" element={<Pages.More />} />
        </Routes>
        <Modals />
      </main>
        {!isTablet && <SideColumn />}
    </div>
  );
}

export default App;
