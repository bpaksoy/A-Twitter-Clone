import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Network from "./Component/Network/index";
import Profile from "./Component/Network/Profile";
import Following from "./Component/Network/Following";
import UserProfile from "./Component/Network/UserProfile";

class App extends Component {
  render() {
    return (
      <div className="bg-stone-200 min-h-screen">
        <Router>
          <Routes>
            <Route path="/" exact element={<Network />} />
            <Route path="/tweets/users/:id" element={<Profile />} />
            <Route path="/user/:id/following" element={<UserProfile />} />
            <Route path="/user/:id/followed_users" element={<Following />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;