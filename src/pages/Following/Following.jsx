import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import VideoCard from '../../components/VideoCard/VideoCard';
import CommentPanel from '../../components/CommentPanel/CommentPanel';
import { Users, UserPlus, CheckCircle2, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import styles from './Following.module.css';

export default function Following() {
  const { allVideos, isUserFollowed, toggleFollow, getUserById } = useApp();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [openCommentVideoId, setOpenCommentVideoId] = useState(null);
  const videoRefs = useRef([]);

  // Followed creators
  const followedCreators = mockUsers.filter(u => isUserFollowed(u.id));

  // Filter videos whose author is in followedUserIds
  const followingVideos = allVideos.filter((v) => isUserFollowed(v.userId));

  // IntersectionObserver
  useEffect(() => {
    if (followingVideos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveVideoIndex(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [followingVideos]);

  const scrollToVideo = (index) => {
    const target = videoRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveVideoIndex(index);
    }
  };

  // If user hasn't followed anyone
  if (followingVideos.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconBox}>
          <Users size={56} className={styles.emptyIcon} />
        </div>
        <h2 className={styles.emptyTitle}>Chưa có video từ người bạn theo dõi</h2>
        <p className={styles.emptyDesc}>
          Hãy theo dõi các nhà sáng tạo nội dung hàng đầu để xem video mới nhất của họ tại đây!
        </p>

        {/* Suggested Creators Cards Grid */}
        <div className={styles.suggestedGrid}>
          {mockUsers.slice(0, 8).map((user) => (
            <div key={user.id} className={styles.suggestedCard}>
              <Link to={`/@${user.username}`} className={styles.cardAvatarLink}>
                <img src={user.avatar} alt={user.nickname} className={styles.cardAvatar} />
              </Link>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleLine}>
                  <span className={styles.cardNickname}>{user.nickname}</span>
                  {user.isVerified && (
                    <CheckCircle2 size={14} className={styles.verifiedIcon} />
                  )}
                </div>
                <span className={styles.cardUsername}>@{user.username}</span>
              </div>
              <button
                className={styles.followBtn}
                onClick={() => toggleFollow(user.id)}
              >
                <UserPlus size={15} />
                <span>Follow</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.followingContainer}>
      {/* Stories / Reels Horizontal Bar at Top */}
      <div className={styles.storiesBar}>
        {followedCreators.map((creator) => (
          <Link
            key={creator.id}
            to={`/@${creator.username}`}
            className={styles.storyItem}
          >
            <div className={styles.storyAvatarRing}>
              <img src={creator.avatar} alt={creator.nickname} className={styles.storyAvatar} />
            </div>
            <span className={styles.storyName}>{creator.nickname}</span>
          </Link>
        ))}
      </div>

      <div className={`${styles.feedWrapper} ${openCommentVideoId ? styles.hasDrawer : ''}`}>
        {followingVideos.map((video, idx) => (
          <div
            key={video.id}
            data-index={idx}
            ref={(el) => (videoRefs.current[idx] = el)}
            className={styles.videoItemContainer}
          >
            <VideoCard
              video={video}
              isActive={idx === activeVideoIndex}
              isCommentOpen={openCommentVideoId === video.id}
              onOpenComments={() =>
                setOpenCommentVideoId(prev => (prev === video.id ? null : video.id))
              }
            />
          </div>
        ))}
      </div>

      {/* Floating Next / Prev Navigation */}
      <div className={styles.floatingNav}>
        <button
          className={styles.navBtn}
          disabled={activeVideoIndex === 0}
          onClick={() => scrollToVideo(Math.max(0, activeVideoIndex - 1))}
          aria-label="Previous video"
        >
          <ChevronUp size={22} />
        </button>

        <button
          className={styles.navBtn}
          disabled={activeVideoIndex === followingVideos.length - 1}
          onClick={() => scrollToVideo(Math.min(followingVideos.length - 1, activeVideoIndex + 1))}
          aria-label="Next video"
        >
          <ChevronDown size={22} />
        </button>
      </div>

      {/* Desktop Comments Drawer */}
      {openCommentVideoId && (
        <aside className={styles.commentDrawer}>
          <CommentPanel
            videoId={openCommentVideoId}
            onClose={() => setOpenCommentVideoId(null)}
          />
        </aside>
      )}
    </div>
  );
}
