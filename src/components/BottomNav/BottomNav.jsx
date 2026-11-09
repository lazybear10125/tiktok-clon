import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Plus, Bell, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const { currentUser, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className={styles.bottomNav}>
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
      >
        <Home size={22} />
        <span>Trang chủ</span>
      </NavLink>

      <NavLink
        to="/following"
        className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
      >
        <Users size={22} />
        <span>Đang Follow</span>
      </NavLink>

      <NavLink to="/upload" className={styles.createTab}>
        <div className={styles.createBtn}>
          <div className={styles.cyanBorder} />
          <div className={styles.redBorder} />
          <div className={styles.whiteBox}>
            <Plus size={20} strokeWidth={3} className={styles.plusIcon} />
          </div>
        </div>
      </NavLink>

      <NavLink
        to="/notifications"
        className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
      >
        <div className={styles.iconWithBadge}>
          <Bell size={22} />
          {unreadCount > 0 && <span className={styles.dotBadge} />}
        </div>
        <span>Hộp thư</span>
      </NavLink>

      <NavLink
        to={currentUser ? `/@${currentUser.username}` : '/'}
        className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
      >
        <User size={22} />
        <span>Hồ sơ</span>
      </NavLink>
    </nav>
  );
}
