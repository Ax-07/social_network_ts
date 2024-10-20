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
import { useCachePostViews } from "./utils/functions/cachePostViews";
import { useTokenRefresh } from "./services/auth/useRefreshToken";

function App() {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1020;
  const refreshToken = useSelector((state: RootState) => state.auth?.refreshToken);
  const isAuth = useSelector((state: RootState) => state.auth?.isAuthenticated);
  const [googleRefreshToken] = useGoogleRefreshTokenMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuth || !refreshToken) return;
      googleRefreshToken({ refreshToken: refreshToken });
    }, 1000 * 60 * 15); // 15 minutes
    return () => clearInterval(interval);
  }, [isAuth, refreshToken, googleRefreshToken]);
  
  useTokenRefresh();
  useCachePostViews();

  // Gestion du focus pour la navigation
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus(); // Assure que le focus est sur le contenu principal lors de la navigation
    }
  }, []);

  return (
    <div className="app">
      <picture className="picture-background" aria-hidden="true">
        <source
          srcSet="/images/app-background/mobile-unsplash_eNoeWZkO7Zc.webp"
          media="(max-width: 600px)"
        />
        <source
          srcSet="/images/app-background/tablet-unsplash_eNoeWZkO7Zc.webp"
          media="(min-width: 601px) and (max-width: 1024px)"
        />
        <source
          srcSet="/images/app-background/desktop-unsplash_eNoeWZkO7Zc.webp"
          media="(min-width: 1025px)"
        />
        <img
          src="/images/app-background/mobile-image.webp"
          alt="Fond d'écran du site"
          loading="lazy"
        />
      </picture>
      <SideMenu />

      <main tabIndex={-1} aria-live="polite">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/auth" element={<Pages.AuthPage />} />
          <Route path="/home/*" element={<Pages.Home />} />
          <Route path="/home/posts/:id" element={<PostPage />} />
          <Route path="/home/comment/:id" element={<CommentPage />} />
          <Route path="/explore/*" element={<Pages.Explore />} />
          <Route path="/notifications/*" element={<Pages.Notifications />} />
          <Route path="/messages" element={<Pages.Messages />} />
          <Route path="/bookmarks" element={<Pages.BooKmarks />} />
          <Route path="/lists" element={<Pages.Lists />} />
          <Route path="/profile/:id/*" element={<Pages.Profile />} />
          <Route path="/more" element={<Pages.More />} />
          <Route path="/reset-password/:token" element={<Pages.ResetPassword />} />
        </Routes>
        <Modals />
      </main>

      {!isTablet && (
        <aside aria-label="Colonne latérale supplémentaire" className="aside">
          <SideColumn />
        </aside>
      )}
    </div>
  );
}

export default App;
