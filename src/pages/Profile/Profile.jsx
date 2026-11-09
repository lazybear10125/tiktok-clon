import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, Lock, Bookmark, FolderHeart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';
import { mockUsers } from '../../data/mockData';
import { formatNumber } from '../../utils/formatters';
import styles from './Profile.module.css';

export default function Profile() {
  const { username } = useParams();
  const cleanUsername = (username || '').replace(/^@/, '');
  const {
    currentUser,
    allVideos,
    isVideoLiked,
    isVideoFavorited,
    openVideoModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'favorites' | 'liked'

  // Find user by username
  const isMe = currentUser && currentUser.username === cleanUsername;
  const targetUser = isMe
    ? currentUser
    : mockUsers.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase()) || mockUsers[0];

  // User's own posted videos
  const userVideos = allVideos.filter(v => v.userId === targetUser.id);

  // User's liked videos
  const likedVideos = allVideos.filter(v => isVideoLiked(v.id));

  // User's favorited videos
  const favoritedVideos = allVideos.filter(v => isVideoFavorited(v.id));

  const getDisplayedVideos = () => {
    switch (activeTab) {
      case 'favorites':
        return favoritedVideos;
      case 'liked':
        return likedVideos;
      default:
        return userVideos;
    }
  };

  const displayedList = getDisplayedVideos();

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader
        user={targetUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          videos: userVideos.length,
          favorites: favoritedVideos.length,
          liked: likedVideos.length,
        }}
      />

      {/* Videos Grid */}
      <div className={styles.gridSection}>
        {displayedList.length === 0 ? (
          <div className={styles.emptyState}>
            {activeTab === 'videos' && <Play size={48} className={styles.emptyIcon} />}
            {activeTab === 'favorites' && <Bookmark size={48} className={styles.emptyIcon} />}
            {activeTab === 'liked' && <FolderHeart size={48} className={styles.emptyIcon} />}

            <h3 className={styles.emptyTitle}>
              {activeTab === 'videos' && 'Chưa có video nào'}
              {activeTab === 'favorites' && 'Chưa có video yêu thích'}
              {activeTab === 'liked' && 'Chưa có video đã thích'}
            </h3>
            <p className={styles.emptyDesc}>
              {activeTab === 'videos' && 'Các video bạn tải lên sẽ xuất hiện tại đây.'}
              {activeTab === 'favorites' && 'Nhấn biểu tượng Yêu thích trên bất kỳ video nào để lưu lại.'}
              {activeTab === 'liked' && 'Nhấn Thích trên bất kỳ video nào để lưu vào danh sách này.'}
            </p>
          </div>
        ) : (
          <div className={styles.videoGrid}>
            {displayedList.map((video) => (
              <div
                key={video.id}
                className={styles.gridItem}
                onClick={() => openVideoModal(video)}
              >
                <div className={styles.videoThumbnailWrapper}>
                  <img src={video.coverUrl} alt={video.description} className={styles.thumbnail} />
                  <div className={styles.thumbnailOverlay}>
                    <div className={styles.viewsCount}>
                      <Play size={14} fill="#fff" />
                      <span>{formatNumber(video.viewsCount)}</span>
                    </div>
                  </div>
                </div>
                <p className={styles.videoCaption}>{video.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
