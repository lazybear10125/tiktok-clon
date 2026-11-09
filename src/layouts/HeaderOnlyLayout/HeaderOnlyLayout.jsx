import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import AuthModal from '../../components/AuthModal/AuthModal';
import Toast from '../../components/Toast/Toast';
import styles from './HeaderOnlyLayout.module.css';

export default function HeaderOnlyLayout() {
  return (
    <div className={styles.appWrapper}>
      <Header />
      <main className={styles.contentArea}>
        <Outlet />
      </main>
      <AuthModal />
      <Toast />
    </div>
  );
}
