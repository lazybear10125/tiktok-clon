import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Users,
  Compass,
  Radio,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Hash,
  Music,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockUsers, trendingKeywords } from '../../data/mockData';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { followedUserIds, isUserFollowed, toggleFollow } = useApp();
  const [showMoreSuggested, setShowMoreSuggested] = useState(false);
  const [showMoreFollowing, setShowMoreFollowing] = useState(false);

  // Suggested accounts (not followed yet)
  const suggestedUsers = mockUsers.filter(u => !isUserFollowed(u.id));
  const displayedSuggested = showMoreSuggested ? suggestedUsers.slice(0, 10) : suggestedUsers.slice(0, 5);

  // Following accounts
  const followingUsers = mockUsers.filter(u => isUserFollowed(u.id));
  const displayedFollowing = showMoreFollowing ? followingUsers.slice(0, 10) : followingUsers.slice(0, 5);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.scrollContent}>
        {/* Main Navigation */}
        <nav className={styles.navSection}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Home size={24} className={styles.navIcon} />
            <span className={styles.navLabel}>Dành cho bạn</span>
          </NavLink>

          <NavLink
            to="/following"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Users size={24} className={styles.navIcon} />
            <span className={styles.navLabel}>Đang Follow</span>
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Compass size={24} className={styles.navIcon} />
            <span className={styles.navLabel}>Khám phá</span>
          </NavLink>

          <NavLink
            to="/live"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Radio size={24} className={styles.navIcon} />
            <span className={styles.navLabel}>LIVE</span>
          </NavLink>
        </nav>

        <div className={styles.divider} />

        {/* Suggested Accounts */}
        <div className={styles.section}>
          <p className={styles.sectionHeader}>Các tài khoản gợi ý</p>
          <div className={styles.userList}>
            {displayedSuggested.map((user) => (
              <Link
                key={user.id}
                to={`/@${user.username}`}
                className={styles.userItem}
              >
                <div className={styles.avatarWrapper}>
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className={styles.userAvatar}
                  />
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userNameRow}>
                    <span className={styles.userNickname}>{user.nickname}</span>
                    {user.isVerified && (
                      <CheckCircle2 size={13} className={styles.verifiedIcon} />
                    )}
                  </div>
                  <span className={styles.userUsername}>@{user.username}</span>
                </div>
              </Link>
            ))}
          </div>

          {suggestedUsers.length > 5 && (
            <button
              className={styles.moreBtn}
              onClick={() => setShowMoreSuggested(prev => !prev)}
            >
              {showMoreSuggested ? (
                <>
                  <span>Thu gọn</span>
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  <span>Xem thêm</span>
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>

        <div className={styles.divider} />

        {/* Following Accounts */}
        {followingUsers.length > 0 && (
          <div className={styles.section}>
            <p className={styles.sectionHeader}>Tài khoản đang theo dõi</p>
            <div className={styles.userList}>
              {displayedFollowing.map((user) => (
                <Link
                  key={user.id}
                  to={`/@${user.username}`}
                  className={styles.userItem}
                >
                  <div className={styles.avatarWrapper}>
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className={styles.userAvatar}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userNameRow}>
                      <span className={styles.userNickname}>{user.nickname}</span>
                      {user.isVerified && (
                        <CheckCircle2 size={13} className={styles.verifiedIcon} />
                      )}
                    </div>
                    <span className={styles.userUsername}>@{user.username}</span>
                  </div>
                </Link>
              ))}
            </div>

            {followingUsers.length > 5 && (
              <button
                className={styles.moreBtn}
                onClick={() => setShowMoreFollowing(prev => !prev)}
              >
                {showMoreFollowing ? (
                  <>
                    <span>Thu gọn</span>
                    <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    <span>Xem thêm</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            )}
            <div className={styles.divider} />
          </div>
        )}

        {/* Explore Trending Badges */}
        <div className={styles.section}>
          <p className={styles.sectionHeader}>Khám phá xu hướng</p>
          <div className={styles.tagsContainer}>
            {trendingKeywords.slice(0, 8).map((tag, idx) => (
              <Link
                key={idx}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className={styles.tagBadge}
              >
                {tag.startsWith('#') ? (
                  <Hash size={13} className={styles.tagIcon} />
                ) : (
                  <Music size={13} className={styles.tagIcon} />
                )}
                <span>{tag.replace(/^#/, '')}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Footer Info */}
        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <a href="#about">Giới thiệu</a>
            <a href="#newsroom">Bảng tin</a>
            <a href="#contact">Liên hệ</a>
            <a href="#careers">Sự nghiệp</a>
            <a href="#byteplus">BytePlus</a>
          </div>
          <div className={styles.footerLinks}>
            <a href="#tiktokforgood">TikTok for Good</a>
            <a href="#advertise">Quảng cáo</a>
            <a href="#developers">Developers</a>
            <a href="#transparency">Minh bạch</a>
          </div>
          <div className={styles.footerLinks}>
            <a href="#help">Trợ giúp</a>
            <a href="#safety">An toàn</a>
            <a href="#terms">Điều khoản</a>
            <a href="#privacy">Quyền riêng tư</a>
          </div>
          <p className={styles.copyright}>© 2026 TikTok Clone - Figma Design System</p>
        </footer>
      </div>
    </aside>
  );
}
