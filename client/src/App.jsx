import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./auth/Login";
import Home from "./views/Home";
import Layout from "./layout/Layout";
import TakeMeToAdmin from "./components/TakeMeToAdmin";
import Register from "./auth/Register";
import Records from "./views/Records";
import Leaderboard from "./views/Leaderboard";
import Rooms from "./views/Rooms";
import Lobby from "./views/Lobby";
import Profile from "./views/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/records"
            element={
              <Layout login={true}>
                <Records />
              </Layout>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <Layout>
                <Leaderboard />
              </Layout>
            }
          />
          <Route
            path="/rooms"
            element={
              <Layout login={true}>
                <Rooms />
              </Layout>
            }
          />
          <Route
            path="/room/:code"
            element={
              <Layout login={true}>
                <Lobby />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout login={true}>
                <Profile />
              </Layout>
            }
          />
          <Route path="/admin" element={<TakeMeToAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
