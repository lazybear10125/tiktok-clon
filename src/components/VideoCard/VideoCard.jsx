import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  CheckCircle2,
  Plus,
  Maximize
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumber } from '../../utils/formatters';
import { renderFormattedCaption } from '../../utils/captionParser';
import styles from './VideoCard.module.css';

export default function VideoCard({
  video,
  isActive = false,
  onOpenComments,
  isCommentOpen = false,
}) {
  const {
    getUserById,
    isUserFollowed,
    toggleFollow,
    isVideoLiked,
    toggleLikeVideo,
    isVideoFavorited,
    toggleFavoriteVideo,
    commentsMap,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    showToast,
    openVideoModal,
  } = useApp();

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayIndicator, setShowPlayIndicator] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const author = getUserById(video.userId);
  const isLiked = isVideoLiked(video.id);
  const isFavorited = isVideoFavorited(video.id);
  const isFollowed = isUserFollowed(video.userId);
  const currentComments = commentsMap[video.id] || [];

  const displayedLikes = isLiked ? video.likesCount + 1 : video.likesCount;
  const totalComments = video.commentsCount + currentComments.length;

  // Auto play/pause when card becomes active/inactive
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isActive) {
      el.muted = isMuted;
      el.volume = volume;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            el.muted = true;
            el.play().then(() => setIsPlaying(true)).catch(() => {});
          });
      }
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // Sync mute and volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
    setShowPlayIndicator(true);
    setTimeout(() => setShowPlayIndicator(false), 500);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Double click on video to trigger floating heart & Like
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      toggleLikeVideo(video.id);
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newHeart = { id: Date.now() + Math.random(), x, y };

    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 900);
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/@${author.username}/video/${video.id}`);
    showToast('Đã sao chép liên kết video vào clipboard!');
  };

  return (
    <div className={styles.videoCard}>
      {/* Author Header */}
      <div className={styles.headerInfo}>
        <div className={styles.authorRow}>
          <Link to={`/@${author.username}`} className={styles.avatarLink}>
            <img src={author.avatar} alt={author.nickname} className={styles.avatar} />
          </Link>

          <div className={styles.nameAndDesc}>
            <div className={styles.authorTitleLine}>
              <Link to={`/@${author.username}`} className={styles.authorNick}>
                {author.nickname}
              </Link>
              {author.isVerified && (
                <CheckCircle2 size={14} className={styles.verifiedIcon} />
              )}
              <span className={styles.authorUser}>@{author.username}</span>
            </div>

            <p className={styles.captionText}>
              {renderFormattedCaption(video.description)}
            </p>

            <div className={styles.musicRow}>
              <Music size={13} className={styles.musicIcon} />
              <span className={styles.musicText}>{video.music}</span>
            </div>
          </div>

          <button
            className={`${styles.followBtn} ${isFollowed ? styles.followed : ''}`}
            onClick={() => toggleFollow(author.id)}
          >
            {isFollowed ? 'Đang Follow' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Main Video Viewport & Actions Row */}
      <div className={styles.videoContentRow}>
        <div
          ref={containerRef}
          className={`${styles.playerContainer} ${isCommentOpen ? styles.contracted : ''}`}
          onDoubleClick={handleDoubleClick}
        >
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.coverUrl}
            loop
            playsInline
            className={styles.videoElement}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
          />

          {/* Floating Hearts from double click */}
          {floatingHearts.map((h) => (
            <div
              key={h.id}
              className={styles.floatingHeart}
              style={{ left: h.x, top: h.y }}
            >
              <Heart size={68} fill="#FE2C55" color="#FE2C55" />
            </div>
          ))}

          {/* Large Center Play / Pause Indicator */}
          {showPlayIndicator && (
            <div className={styles.centerIndicator}>
              {isPlaying ? <Play size={54} /> : <Pause size={54} />}
            </div>
          )}

          {/* Top Video Overlay Controls */}
          <div className={styles.videoTopOverlay}>
            <div
              className={styles.volumeControlWrapper}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              {showVolumeSlider && (
                <div className={styles.volumeSliderContainer}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setVolume(val);
                      if (val > 0 && isMuted) toggleMute();
                    }}
                    className={styles.volumeSlider}
                  />
                </div>
              )}
              <button
                className={styles.overlayIconBtn}
                onClick={toggleMute}
                aria-label="Toggle mute"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            <button
              className={styles.overlayIconBtn}
              onClick={handleFullscreen}
              aria-label="Fullscreen"
            >
              <Maximize size={18} />
            </button>
          </div>

          {/* Bottom Progress Bar */}
          <div className={styles.progressBarWrapper} onClick={handleSeek}>
            <div
              className={styles.progressBar}
              style={{
                width: duration ? `${(currentTime / duration) * 100}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* Vertical Action Buttons */}
        <div className={styles.actionButtonsCol}>
          <div className={styles.avatarActionItem}>
            <Link to={`/@${author.username}`} className={styles.actionAvatarLink}>
              <img src={author.avatar} alt={author.nickname} className={styles.actionAvatar} />
            </Link>
            {!isFollowed && (
              <button
                className={styles.plusFollowBtn}
                onClick={() => toggleFollow(author.id)}
                aria-label="Quick follow"
              >
                <Plus size={13} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Like */}
          <div className={styles.actionItem}>
            <button
              className={`${styles.actionCircleBtn} ${isLiked ? styles.activeHeart : ''}`}
              onClick={() => toggleLikeVideo(video.id)}
              aria-label="Like video"
            >
              <Heart
                size={22}
                fill={isLiked ? 'var(--primary)' : 'none'}
                color={isLiked ? 'var(--primary)' : 'currentColor'}
                className={isLiked ? 'animate-heart-pop' : ''}
              />
            </button>
            <span className={styles.actionCount}>{formatNumber(displayedLikes)}</span>
          </div>

          {/* Comments */}
          <div className={styles.actionItem}>
            <button
              className={`${styles.actionCircleBtn} ${isCommentOpen ? styles.activeComment : ''}`}
              onClick={onOpenComments}
              aria-label="Comments"
            >
              <MessageCircle size={22} />
            </button>
            <span className={styles.actionCount}>{formatNumber(totalComments)}</span>
          </div>

          {/* Bookmark */}
          <div className={styles.actionItem}>
            <button
              className={`${styles.actionCircleBtn} ${isFavorited ? styles.activeBookmark : ''}`}
              onClick={() => toggleFavoriteVideo(video.id)}
              aria-label="Bookmark"
            >
              <Bookmark
                size={22}
                fill={isFavorited ? '#FACE15' : 'none'}
                color={isFavorited ? '#FACE15' : 'currentColor'}
              />
            </button>
            <span className={styles.actionCount}>
              {formatNumber(video.sharesCount / 2 + (isFavorited ? 1 : 0))}
            </span>
          </div>

          {/* Share */}
          <div className={styles.actionItem}>
            <button
              className={styles.actionCircleBtn}
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 size={22} />
            </button>
            <span className={styles.actionCount}>{formatNumber(video.sharesCount)}</span>
          </div>

          {/* Vinyl Disc with Floating Music Notes */}
          <div className={styles.vinylDiscWrapper} onClick={() => openVideoModal(video)}>
            {isPlaying && (
              <>
                <span className={`${styles.musicNote} animate-note-1`}>♪</span>
                <span className={`${styles.musicNote} animate-note-2`}>♫</span>
              </>
            )}
            <div className={`${styles.vinylDisc} ${isPlaying ? 'animate-disc-rotate' : ''}`}>
              <img src={author.avatar} alt="sound" className={styles.vinylImg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
