import { Routes, Route, Navigate  } from "react-router-dom";
import SideMenu from "./layouts/sideMenu/SideMenu";
import SideColumn from "./layouts/sideColumn/SideColumn";
import Home from "./pages/home/Home";
import Explore from "./pages/explore/Explore";
import Notifications from "./pages/notifications/Notifications";
import Messages from "./pages/messages/Messages";
import BooKmarks from "./pages/bookmarks/BooKmarks";
import Lists from "./pages/lists/Lists";
import Profile from "./pages/profile/Profile";
import More from "./pages/more/More";
import { useWindowSize } from "./utils/hooks/useWindowSize";
import Modal from "./components/modal/Modal";
import AddPost from "./components/post/AddPost";
import {useModal} from "./components/modal/useModal"; // Assurez-vous que le chemin est correct
import AuthPage from "./pages/auth/AuthPage";
import { useEffect } from "react";
import { useGoogleRefreshTokenMutation } from "./services/auth/googleAuthApi";
import { useSelector } from "react-redux";
import { RootState } from "./services/stores";

function App() {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1020;
  const { modals } = useModal();
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
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookmarks" element={<BooKmarks />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/more" element={<More />} />
        </Routes>
        {modals && (
          <Modal modalName="Post">
            <AddPost origin="modal"/>
          </Modal>
        )}
      </main>
        {!isTablet && <SideColumn />}
    </div>
  );
}

export default App;
