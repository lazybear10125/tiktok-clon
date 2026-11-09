import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import HeaderOnlyLayout from './layouts/HeaderOnlyLayout/HeaderOnlyLayout';

import Home from './pages/Home/Home';
import Following from './pages/Following/Following';
import Explore from './pages/Explore/Explore';
import Live from './pages/Live/Live';
import Profile from './pages/Profile/Profile';
import Search from './pages/Search/Search';
import Notifications from './pages/Notifications/Notifications';
import Upload from './pages/Upload/Upload';

export default function App() {
  return (
    <Routes>
      {/* Main Layout with Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/following" element={<Following />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/live" element={<Live />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Header Only Layout */}
      <Route element={<HeaderOnlyLayout />}>
        <Route path="/upload" element={<Upload />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
