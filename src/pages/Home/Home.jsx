import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import VideoCard from '../../components/VideoCard/VideoCard';
import CommentPanel from '../../components/CommentPanel/CommentPanel';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const { allVideos, toggleLikeVideo, toggleMute } = useApp();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [openCommentVideoId, setOpenCommentVideoId] = useState(null);
  const videoRefs = useRef([]);

  // IntersectionObserver to auto-detect which video is in center of viewport
  useEffect(() => {
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
      {
        threshold: 0.6,
      }
    );

    videoRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [allVideos]);

  // Keyboard navigation: W / S or ArrowUp / ArrowDown, L to like, M to mute
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        scrollToVideo(Math.min(activeVideoIndex + 1, allVideos.length - 1));
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        scrollToVideo(Math.max(activeVideoIndex - 1, 0));
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        const currentVid = allVideos[activeVideoIndex];
        if (currentVid) toggleLikeVideo(currentVid.id);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoIndex, allVideos]);

  const scrollToVideo = (index) => {
    const target = videoRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveVideoIndex(index);
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* Video Feed Column */}
      <div className={`${styles.feedWrapper} ${openCommentVideoId ? styles.hasDrawer : ''}`}>
        {allVideos.map((video, idx) => (
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

      {/* Floating Next / Prev Navigation Buttons */}
      <div className={styles.floatingNav}>
        <button
          className={styles.navBtn}
          disabled={activeVideoIndex === 0}
          onClick={() => scrollToVideo(Math.max(0, activeVideoIndex - 1))}
          data-tooltip="Video trước (W / ↑)"
          aria-label="Previous video"
        >
          <ChevronUp size={22} />
        </button>

        <button
          className={styles.navBtn}
          disabled={activeVideoIndex === allVideos.length - 1}
          onClick={() => scrollToVideo(Math.min(allVideos.length - 1, activeVideoIndex + 1))}
          data-tooltip="Video tiếp theo (S / ↓)"
          aria-label="Next video"
        >
          <ChevronDown size={22} />
        </button>
      </div>

      {/* Desktop Comments Drawer (smooth right panel) */}
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
