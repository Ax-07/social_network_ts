import { Routes, Route } from "react-router-dom";
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

function App() {
  const { windowWidth } = useWindowSize();
  const isTablet = windowWidth <= 1020;
  return (
    <div className="app">
      <picture className="picture-background">
        <source srcSet={"src/assets/images/app-background/mobile-unsplash_eNoeWZkO7Zc.webp"} media="(max-width: 600px)" />
        <source
          srcSet="src/assets/images/app-background/tablet-unsplash_eNoeWZkO7Zc.webp"
          media="(min-width: 601px) and (max-width: 1024px)"
        />
        <source srcSet="src/assets/images/app-background/desktop-unsplash_eNoeWZkO7Zc.webp" media="(min-width: 1025px)" />
        <img src="src/assets/images/app-background/mobile-image.webp" alt="image de fond de l'application" loading="lazy" />
      </picture>
      <SideMenu />
      <main>
        <Routes>
          <Route path="/home/*" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookmarks" element={<BooKmarks />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/more" element={<More />} />
        </Routes>
      {!isTablet && <SideColumn />}
      </main>
    </div>
  );
}

export default App;
