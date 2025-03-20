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
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

      </Routes>
    </Router>
  );
};

export default App;
