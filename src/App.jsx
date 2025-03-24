import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser as setUserInStore } from "./features/userSlice"; // Import the action to set the user

import Home from "./pages/Home";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Album from "./pages/Albums";
import Profile from "./auth/Profile";
import Layout from "./Layout";
import SongInfo from "./components/SongInfo";
import AlbumInfo from "./components/AlbumInfo";
import ArtistInfo from "./components/ArtistInfo";
import Artist from "./pages/Artist";
import Genre from "./pages/Genre";
import TopTrack from "./pages/TopTrack";

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
          <Route path="/albums" element={<Album />} />
          <Route path="/song/:id" element={<SongInfo />} />
          <Route path="/album/:id" element={<AlbumInfo />} />
          <Route path="/artists" element={<Artist />} />
          <Route path="/artist/:id" element={<ArtistInfo />} />
          <Route path="/genres" element={<Genre />} />
          <Route path="/top_track" element={<TopTrack />} />


        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

      </Routes>
    </Router>
  );
};

export default App;
