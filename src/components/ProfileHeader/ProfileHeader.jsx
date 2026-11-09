import React from 'react';
import { CheckCircle2, UserPlus, UserCheck, Share2, Edit3, Link as LinkIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumber } from '../../utils/formatters';
import styles from './ProfileHeader.module.css';

export default function ProfileHeader({
  user,
  activeTab,
  onTabChange,
  counts = { videos: 0, liked: 0, favorites: 0 }
}) {
  const { currentUser, isUserFollowed, toggleFollow, showToast } = useApp();
  const isMe = currentUser && currentUser.username === user.username;
  const isFollowed = isUserFollowed(user.id);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Đã sao chép liên kết hồ sơ!');
  };

  return (
    <div className={styles.container}>
      {/* Top Profile Summary */}
      <div className={styles.summaryRow}>
        <div className={styles.avatarWrapper}>
          <img src={user.avatar} alt={user.nickname} className={styles.avatar} />
        </div>

        <div className={styles.infoCol}>
          <div className={styles.titleRow}>
            <h1 className={styles.username}>{user.username}</h1>
            {user.isVerified && (
              <CheckCircle2 size={18} className={styles.verifiedIcon} />
            )}
          </div>

          <h2 className={styles.nickname}>{user.nickname}</h2>

          <div className={styles.actionsRow}>
            {isMe ? (
              <button
                className={styles.editBtn}
                onClick={() => showToast('Chức năng chỉnh sửa hồ sơ đang mở!')}
              >
                <Edit3 size={16} />
                <span>Sửa hồ sơ</span>
              </button>
            ) : (
              <button
                className={`${styles.followBtn} ${isFollowed ? styles.followed : ''}`}
                onClick={() => toggleFollow(user.id)}
              >
                {isFollowed ? (
                  <>
                    <UserCheck size={16} />
                    <span>Đang Follow</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}

            <button
              className={styles.shareBtn}
              onClick={handleShareProfile}
              aria-label="Share profile"
              data-tooltip="Chia sẻ hồ sơ"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row (Following, Followers, Likes) */}
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <strong className={styles.statNumber}>{formatNumber(user.followingCount)}</strong>
          <span className={styles.statLabel}>Đang Follow</span>
        </div>

        <div className={styles.statItem}>
          <strong className={styles.statNumber}>
            {formatNumber(isFollowed ? user.followersCount + 1 : user.followersCount)}
          </strong>
          <span className={styles.statLabel}>Follower</span>
        </div>

        <div className={styles.statItem}>
          <strong className={styles.statNumber}>{formatNumber(user.likesCount)}</strong>
          <span className={styles.statLabel}>Thích</span>
        </div>
      </div>

      {/* Bio & Links */}
      <div className={styles.bioSection}>
        <p className={styles.bioText}>{user.bio || 'Chưa có tiểu sử.'}</p>
        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.websiteLink}
          >
            <LinkIcon size={14} />
            <span>{user.website}</span>
          </a>
        )}
      </div>

      {/* Profile Tabs (Videos, Liked, Favorites) */}
      <div className={styles.tabsRow}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'videos' ? styles.tabActive : ''}`}
          onClick={() => onTabChange('videos')}
        >
          <span>Video</span>
          <span className={styles.tabCount}>({counts.videos})</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.tabActive : ''}`}
          onClick={() => onTabChange('favorites')}
        >
          <span>Yêu thích</span>
          <span className={styles.tabCount}>({counts.favorites})</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'liked' ? styles.tabActive : ''}`}
          onClick={() => onTabChange('liked')}
        >
          <span>Đã thích</span>
          <span className={styles.tabCount}>({counts.liked})</span>
        </button>
      </div>
    </div>
  );
}
