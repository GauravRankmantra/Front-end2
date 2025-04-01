import React from "react";
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

const App = () => {
  const user = useSelector((state) => state.user.user); // Get user from Redux store

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          <Route path="/Oauth" element={<OAuthRedirectHandler />} />
          <Route path="/albums" element={<Album />} />
          <Route path="/song/:id" element={<SongInfo />} />
          <Route path="/album/:id" element={<AlbumInfo />} />
          <Route path="/artists" element={<Artist />} />
          <Route path="/artist/:id" element={<ArtistInfo />} />
          <Route path="/genres" element={<Genre />} />
          <Route path="/genre/:name" element={<GenreInfo />} />
          <Route path="/top_track" element={<TopTrack />} />
          <Route path="/history" element={<History />} />
          <Route path="/favourites" element={<Favourites/>}/>
          <Route path="/create-playlist" element={<CreatePlaylist />} />
          <Route path="/downloads" element={<Download />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forget_pass" element={<ForgetPass />} />
      </Routes>
    </Router>
  );
};

export default App;
