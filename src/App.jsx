import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Home from "./pages/Home";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Album from "./pages/Albums";
import Profile from "./auth/Profile";
import Layout from "./Layout";
import LayoutProfile from "./LayoutProfile";
import SongInfo from "./components/Song/SongInfo";
import AlbumInfo from "./components/Album/AlbumInfo";
import ArtistInfo from "./components/ArtistInfo";
import Artist from "./pages/Artist";
import Genre from "./pages/Genre";
import TopTrack from "./pages/TopTrack";
import ForgetPass from "./auth/ForgetPass";
import GenreInfo from "./components/GenreInfo";
import Download from "./pages/Download";
import OAuthRedirectHandler from "./auth/OAuthRedirectHandler";
import SearchResults from "./components/SearchResults";
import CreatePlaylist from "./components/playlist/CreatePlaylist";
import History from "./components/History";
import Favourites from "./components/Favourites";
import Purchase from "./pages/Purchase";
import SuccessPage from "./pages/SuccessPage";
import FeaturedPlaylist from "./pages/FeaturedPlaylist";
import PlaylistInfo from "./components/Album/PlaylistInfo";
import Contact from "./pages/Contact";
import Privicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import { checkAuth } from "./features/authSlice";
import PurchasedTracks from "./components/PurchasedTracks";

import Dashboard from "./components/Profile/Dashbord";
import ActivityTracker from "./components/ActivityTracker";
import PurchasedSongs from "./components/Profile/PurchasedSongs";
import Message from "./components/Profile/Message";
import Event from "./components/Profile/Event";
import Live from "./components/Profile/Live";
import Offers from "./components/Profile/Offers";
import LikedSongs from "./components/Profile/LikedSongs";
import DownloadDash from "./components/Profile/Download";
import HistoryDash from "./components/Profile/History";
import SellSongs from "./components/Profile/SellSongs";
import SellSongLanding from "./components/SellSongLanding";
import Withdrawal from "./components/Profile/Withdrawal";
import LoginCard from "./components/LoginCard";
import { setShowLoginPopup } from "./features/uiSlice";
import VideoStore from "./components/VideoStore";
import OdgRadio from "./components/OdgRadio";
import Playlist from "./components/Profile/Playlist";

const App = () => {
  const user = useSelector((state) => state.user.user);
  const showLoginPopup = useSelector((state) => state.ui.showLoginPopup);
  const loginPopupSong = useSelector((state) => state.ui.loginPopupSong);

  console.log("user from app", user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  const closeLoginPopup = () => {
    dispatch(setShowLoginPopup(false));
  };

  return (
    <>
      <Router>
        {user && <ActivityTracker userId={user._id} />}
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            {/* <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          /> */}

            <Route path="/Oauth" element={<OAuthRedirectHandler />} />
            <Route path="/albums" element={<Album />} />
            <Route path="/song/:id" element={<SongInfo />} />
            <Route path="/album/:id" element={<AlbumInfo />} />
            <Route path="/playlist/:id" element={<PlaylistInfo />} />
            <Route path="/artists" element={<Artist />} />
            <Route path="/artist/:id" element={<ArtistInfo />} />
            <Route path="/genres" element={<Genre />} />
            <Route path="/genre/:name" element={<GenreInfo />} />
            <Route path="/top_track" element={<TopTrack />} />
            <Route path="/history" element={<History />} />
            <Route path="/purchased-tracks" element={<PurchasedTracks />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privicy />} />
            <Route path="/sell-songs" element={<SellSongLanding />} />
            <Route path="purchased" element={<Purchase />} />
            <Route path="/terms-and-conditions" element={<Terms />} />

            <Route path="/video-store" element={<VideoStore />} />

            <Route path="/odg-radio" element={<OdgRadio />} />

            <Route path="/favourites" element={<Favourites />} />
            <Route path="/create-playlist" element={<CreatePlaylist />} />
            <Route path="/featured-playlist" element={<FeaturedPlaylist />} />
            <Route path="/downloads" element={<Download />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
          <Route element={<LayoutProfile />}>
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
                        <Route
              path="/dashboard/playlist"
              element={user ? <Playlist /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />

            <Route
              path="/dashboard/withdrawal"
              element={user ? <Withdrawal /> : <Navigate to="/login" />}
            />

            <Route
              path="/dashboard/purchased-songs"
              element={user ? <PurchasedSongs /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard/messages"
              element={user ? <Message /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard/event"
              element={user ? <Event /> : <Navigate to="/login" />}
            />

            <Route
              path="/dashboard/sell-song"
              element={user ? <SellSongs /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard/live"
              element={user ? <Live /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard/offer"
              element={user ? <Offers /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard/history"
              element={user ? <HistoryDash /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard/liked"
              element={user ? <LikedSongs /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard/download"
              element={user ? <DownloadDash /> : <Navigate to="/login" />}
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forget_pass" element={<ForgetPass />} />
        </Routes>
      </Router>

      {showLoginPopup && loginPopupSong && (
        <LoginCard song={loginPopupSong} onClose={closeLoginPopup} />
      )}
    </>
  );
};

export default App;
