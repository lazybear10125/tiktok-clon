import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Play, UserPlus, UserCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import { formatNumber } from '../../utils/formatters';
import styles from './Search.module.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { allVideos, isUserFollowed, toggleFollow, getUserById, openVideoModal } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'accounts' | 'videos'

  // Filter matching accounts
  const matchingAccounts = mockUsers.filter(u =>
    u.username.toLowerCase().includes(query.toLowerCase()) ||
    u.nickname.toLowerCase().includes(query.toLowerCase()) ||
    u.bio.toLowerCase().includes(query.toLowerCase())
  );

  // Filter matching videos
  const matchingVideos = allVideos.filter(v =>
    v.description.toLowerCase().includes(query.toLowerCase()) ||
    v.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    v.music.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Search Header Tabs */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Hàng đầu
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'accounts' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Tài khoản ({matchingAccounts.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'videos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Video ({matchingVideos.length})
        </button>
      </div>

      {/* Query Banner */}
      <div className={styles.queryBanner}>
        <span>Kết quả tìm kiếm cho: </span>
        <strong>"{query}"</strong>
      </div>

      {/* Content */}
      <div className={styles.resultsContent}>
        {/* Accounts Section */}
        {(activeTab === 'all' || activeTab === 'accounts') && matchingAccounts.length > 0 && (
          <div className={styles.section}>
            {activeTab === 'all' && <h3 className={styles.sectionTitle}>Tài khoản</h3>}
            <div className={styles.accountsList}>
              {matchingAccounts.map((account) => {
                const followed = isUserFollowed(account.id);
                return (
                  <div key={account.id} className={styles.accountCard}>
                    <Link to={`/@${account.username}`} className={styles.accountAvatarLink}>
                      <img src={account.avatar} alt={account.nickname} className={styles.accountAvatar} />
                    </Link>

                    <div className={styles.accountInfo}>
                      <Link to={`/@${account.username}`} className={styles.accountTitleRow}>
                        <strong className={styles.accountNickname}>{account.nickname}</strong>
                        {account.isVerified && (
                          <CheckCircle2 size={14} className={styles.verifiedIcon} />
                        )}
                      </Link>
                      <span className={styles.accountUsername}>@{account.username}</span>
                      <p className={styles.accountBio}>{account.bio}</p>
                      <span className={styles.accountStats}>
                        {formatNumber(account.followersCount)} Follower • {formatNumber(account.likesCount)} Thích
                      </span>
                    </div>

                    <button
                      className={`${styles.followBtn} ${followed ? styles.followed : ''}`}
                      onClick={() => toggleFollow(account.id)}
                    >
                      {followed ? (
                        <>
                          <UserCheck size={15} />
                          <span>Đang Follow</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={15} />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {(activeTab === 'all' || activeTab === 'videos') && matchingVideos.length > 0 && (
          <div className={styles.section}>
            {activeTab === 'all' && <h3 className={styles.sectionTitle}>Video</h3>}
            <div className={styles.videoGrid}>
              {matchingVideos.map((video) => {
                const author = getUserById(video.userId);
                return (
                  <div
                    key={video.id}
                    className={styles.videoCard}
                    onClick={() => openVideoModal(video)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.thumbnailWrapper}>
                      <img src={video.coverUrl} alt={video.description} className={styles.thumbnail} />
                      <div className={styles.thumbnailOverlay}>
                        <div className={styles.viewBadge}>
                          <Play size={12} fill="#fff" />
                          <span>{formatNumber(video.viewsCount)}</span>
                        </div>
                      </div>
                    </div>
                    <p className={styles.videoCaption}>{video.description}</p>
                    <Link to={`/@${author.username}`} onClick={(e) => e.stopPropagation()} className={styles.authorRow}>
                      <img src={author.avatar} alt={author.nickname} className={styles.authorAvatar} />
                      <span className={styles.authorName}>{author.nickname}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {matchingAccounts.length === 0 && matchingVideos.length === 0 && (
          <div className={styles.emptyState}>
            <SearchIcon size={56} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Không tìm thấy kết quả phù hợp</h3>
            <p className={styles.emptyDesc}>
              Hãy thử tìm kiếm với các từ khóa khác hoặc kiểm tra lại chính tả.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
