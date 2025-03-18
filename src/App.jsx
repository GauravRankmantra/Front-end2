import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from "./components/Home";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Profile from "./auth/Profile";
import Layout from "./Layout";
import SongInfo from "./components/SongInfo"

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the user from localStorage whenever App is mounted
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse JSON to get user object
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
        </Route>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/song/:id" element={<SongInfo />} />
      </Routes>
    </Router>
  );
};

export default App;
