import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import BottomNav from '../../components/BottomNav/BottomNav';
import AuthModal from '../../components/AuthModal/AuthModal';
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal';
import VideoDetailModal from '../../components/VideoDetailModal/VideoDetailModal';
import Toast from '../../components/Toast/Toast';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.appWrapper}>
      <Header />
      <div className={styles.mainContainer}>
        <Sidebar />
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <AuthModal />
      <EditProfileModal />
      <VideoDetailModal />
      <Toast />
    </div>
  );
}
