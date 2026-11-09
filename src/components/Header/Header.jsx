import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Moon,
  Sun,
  Send,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Keyboard,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Header.module.css';

export default function Header() {
  const {
    theme,
    toggleTheme,
    currentUser,
    openAuthModal,
    notifications,
    showToast,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logoLink} aria-label="TikTok Home">
          <div className={styles.logoContainer}>
            <svg
              className={styles.tiktokSvg}
              viewBox="0 0 118 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* TikTok Icon Mark with 3D Cyan & Red offset */}
              <g transform="translate(0, 2)">
                <path
                  d="M19.5 0h-4v19.2c0 3.2-2.6 5.8-5.8 5.8s-5.8-2.6-5.8-5.8 2.6-5.8 5.8-5.8c.6 0 1.2.1 1.7.3V9.5c-.6-.1-1.1-.2-1.7-.2C4.3 9.3 0 13.6 0 19c0 5.4 4.3 9.7 9.7 9.7 5.4 0 9.7-4.3 9.7-9.7V9.1c3.1 2.2 6.8 3.5 10.9 3.5V8.6c-4.4 0-8.2-2.7-9.8-6.6-.7-1.1-.9-1.5-1-2z"
                  fill="var(--secondary)"
                  transform="translate(-1.5, -1)"
                />
                <path
                  d="M19.5 0h-4v19.2c0 3.2-2.6 5.8-5.8 5.8s-5.8-2.6-5.8-5.8 2.6-5.8 5.8-5.8c.6 0 1.2.1 1.7.3V9.5c-.6-.1-1.1-.2-1.7-.2C4.3 9.3 0 13.6 0 19c0 5.4 4.3 9.7 9.7 9.7 5.4 0 9.7-4.3 9.7-9.7V9.1c3.1 2.2 6.8 3.5 10.9 3.5V8.6c-4.4 0-8.2-2.7-9.8-6.6-.7-1.1-.9-1.5-1-2z"
                  fill="var(--primary)"
                  transform="translate(1.5, 1)"
                />
                <path
                  d="M19.5 0h-4v19.2c0 3.2-2.6 5.8-5.8 5.8s-5.8-2.6-5.8-5.8 2.6-5.8 5.8-5.8c.6 0 1.2.1 1.7.3V9.5c-.6-.1-1.1-.2-1.7-.2C4.3 9.3 0 13.6 0 19c0 5.4 4.3 9.7 9.7 9.7 5.4 0 9.7-4.3 9.7-9.7V9.1c3.1 2.2 6.8 3.5 10.9 3.5V8.6c-4.4 0-8.2-2.7-9.8-6.6-.7-1.1-.9-1.5-1-2z"
                  fill="var(--text-primary)"
                />
              </g>
              {/* TikTok Text Wordmark */}
              <text
                x="38"
                y="23"
                fontFamily="var(--font-family)"
                fontWeight="800"
                fontSize="24"
                letterSpacing="-0.8"
                fill="var(--text-primary)"
              >
                TikTok
              </text>
            </svg>
          </div>
        </Link>

        {/* Center Search Bar */}
        <div className={styles.centerSection}>
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className={styles.rightSection}>
          {/* Upload Button */}
          <Link to="/upload" className={styles.uploadBtn}>
            <Plus size={20} strokeWidth={2.5} />
            <span>Tải lên</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            data-tooltip={theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Messages */}
          <button
            className={styles.iconBtn}
            onClick={() => showToast('Tính năng Hộp thư tin nhắn đang mở!')}
            data-tooltip="Tin nhắn"
            aria-label="Messages"
          >
            <Send size={20} />
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className={`${styles.iconBtn} ${styles.notificationBtn}`}
            data-tooltip="Hộp thư"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </Link>

          {/* User Profile / Menu */}
          {currentUser ? (
            <div className={styles.userMenuWrapper} ref={userMenuRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                aria-label="User profile menu"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.nickname}
                  className={styles.avatar}
                />
              </button>

              {isUserMenuOpen && (
                <div className={styles.userDropdown}>
                  <Link
                    to={`/@${currentUser.username}`}
                    className={styles.dropdownItem}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Xem hồ sơ</span>
                  </Link>

                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      showToast('Đang mở cài đặt...');
                    }}
                  >
                    <Settings size={18} />
                    <span>Cài đặt</span>
                  </button>

                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      showToast('Tiếng Việt (Việt Nam)');
                    }}
                  >
                    <Globe size={18} />
                    <span>Tiếng Việt</span>
                  </button>

                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      showToast('Phím tắt: W (Lên), S (Xuống), L (Like), M (Mute)');
                    }}
                  >
                    <Keyboard size={18} />
                    <span>Phím tắt</span>
                  </button>

                  <div className={styles.dropdownDivider} />

                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal('login');
                    }}
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className={styles.loginBtn}
              onClick={() => openAuthModal('login')}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
