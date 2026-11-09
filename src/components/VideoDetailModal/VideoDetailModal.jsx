import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
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
  ChevronUp,
  ChevronDown,
  Trash2,
  Smile,
  Send,
  CornerDownRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumber, formatTimeAgo } from '../../utils/formatters';
import { renderFormattedCaption } from '../../utils/captionParser';
import styles from './VideoDetailModal.module.css';

const quickEmojis = ['😂', '❤️', '🔥', '👏', '💯', '😍', '🥺', '🎉', '🚀', '✨'];

export default function VideoDetailModal() {
  const {
    activeVideoModal,
    closeVideoModal,
    allVideos,
    getUserById,
    currentUser,
    isUserFollowed,
    toggleFollow,
    isVideoLiked,
    toggleLikeVideo,
    isVideoFavorited,
    toggleFavoriteVideo,
    commentsMap,
    addComment,
    deleteComment,
    toggleCommentLike,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    showToast,
  } = useApp();

  const video = activeVideoModal;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  if (!video) return null;

  const author = getUserById(video.userId);
  const isLiked = isVideoLiked(video.id);
  const isFavorited = isVideoFavorited(video.id);
  const isFollowed = isUserFollowed(video.userId);
  const comments = commentsMap[video.id] || [];

  const currentIndex = allVideos.findIndex(v => v.id === video.id);

  // Sync video audio
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [isMuted, volume, playbackSpeed, video]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNextVideo = () => {
    if (currentIndex < allVideos.length - 1) {
      const nextVid = allVideos[currentIndex + 1];
      videoRef.current?.pause();
      useApp.activeVideoModal = nextVid; // trigger modal change
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      const prevVid = allVideos[currentIndex - 1];
      videoRef.current?.pause();
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addComment(video.id, inputText, replyingTo ? replyingTo.id : null);
    setInputText('');
    setReplyingTo(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/@${author.username}/video/${video.id}`);
    showToast('Đã sao chép liên kết video vào clipboard!');
  };

  return (
    <div className={styles.overlay} onClick={closeVideoModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Video Theater Room */}
        <div className={styles.videoPane}>
          {/* Blurred background frame */}
          <div
            className={styles.blurBackdrop}
            style={{ backgroundImage: `url(${video.coverUrl})` }}
          />

          {/* Close button */}
          <button className={styles.closeBtn} onClick={closeVideoModal} aria-label="Close modal">
            <X size={24} />
          </button>

          {/* Video Container */}
          <div className={styles.videoWrapper} onClick={togglePlay}>
            <video
              ref={videoRef}
              src={video.videoUrl}
              autoPlay
              loop
              playsInline
              className={styles.videoPlayer}
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
            />

            {!isPlaying && (
              <div className={styles.centerPlayIcon}>
                <Play size={64} fill="#fff" />
              </div>
            )}
          </div>

          {/* Bottom Player Bar */}
          <div className={styles.playerControlBar}>
            <button className={styles.ctrlBtn} onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button className={styles.ctrlBtn} onClick={toggleMute}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Progress Bar */}
            <div
              className={styles.progressBarWrapper}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (videoRef.current) {
                  videoRef.current.currentTime = pos * duration;
                }
              }}
            >
              <div
                className={styles.progressBar}
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>

            {/* Playback Speed Picker */}
            <div className={styles.speedWrapper}>
              <button
                className={styles.speedBtn}
                onClick={() => setShowSpeedMenu(prev => !prev)}
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className={styles.speedMenu}>
                  {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      className={`${styles.speedChoice} ${playbackSpeed === speed ? styles.speedActive : ''}`}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        setShowSpeedMenu(false);
                      }}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Author, Caption & Comments Thread */}
        <div className={styles.infoPane}>
          {/* Author Card Header */}
          <div className={styles.authorHeader}>
            <Link to={`/@${author.username}`} onClick={closeVideoModal} className={styles.authorLink}>
              <img src={author.avatar} alt={author.nickname} className={styles.authorAvatar} />
              <div className={styles.authorText}>
                <div className={styles.nicknameRow}>
                  <strong>{author.nickname}</strong>
                  {author.isVerified && <CheckCircle2 size={14} className={styles.verifiedIcon} />}
                </div>
                <span className={styles.username}>@{author.username}</span>
              </div>
            </Link>

            <button
              className={`${styles.followBtn} ${isFollowed ? styles.followed : ''}`}
              onClick={() => toggleFollow(author.id)}
            >
              {isFollowed ? 'Đang Follow' : 'Follow'}
            </button>
          </div>

          {/* Caption & Music */}
          <div className={styles.captionSection}>
            <p className={styles.captionText}>
              {renderFormattedCaption(video.description)}
            </p>
            <div className={styles.musicTag}>
              <Music size={14} />
              <span>{video.music}</span>
            </div>
          </div>

          {/* Action Stats & Copy Link */}
          <div className={styles.statsBar}>
            <div className={styles.leftStats}>
              <button
                className={`${styles.statBtn} ${isLiked ? styles.activeHeart : ''}`}
                onClick={() => toggleLikeVideo(video.id)}
              >
                <Heart size={20} fill={isLiked ? 'var(--primary)' : 'none'} />
                <span>{formatNumber(video.likesCount + (isLiked ? 1 : 0))}</span>
              </button>

              <button className={styles.statBtn}>
                <MessageCircle size={20} />
                <span>{formatNumber(comments.length)}</span>
              </button>

              <button
                className={`${styles.statBtn} ${isFavorited ? styles.activeBookmark : ''}`}
                onClick={() => toggleFavoriteVideo(video.id)}
              >
                <Bookmark size={20} fill={isFavorited ? '#FACE15' : 'none'} />
                <span>{formatNumber(video.sharesCount / 2 + (isFavorited ? 1 : 0))}</span>
              </button>
            </div>

            <button className={styles.copyLinkBtn} onClick={handleCopyLink}>
              <Share2 size={16} />
              <span>Sao chép liên kết</span>
            </button>
          </div>

          {/* Comments List */}
          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <div className={styles.emptyComments}>
                <MessageCircle size={40} className={styles.emptyIcon} />
                <p>Chưa có bình luận nào</p>
                <span>Hãy là người đầu tiên bình luận!</span>
              </div>
            ) : (
              comments.map(c => {
                const cAuthor = getUserById(c.userId);
                const isMyComment = currentUser && currentUser.id === c.userId;
                return (
                  <div key={c.id} className={styles.commentItem}>
                    <img src={cAuthor.avatar} alt={cAuthor.nickname} className={styles.cAvatar} />
                    <div className={styles.cBody}>
                      <div className={styles.cTop}>
                        <strong>{cAuthor.nickname}</strong>
                        <span>{formatTimeAgo(c.createdAt)}</span>
                      </div>
                      <p className={styles.cText}>{c.text}</p>
                      <div className={styles.cActions}>
                        <button className={styles.replyBtn} onClick={() => setReplyingTo(c)}>
                          Trả lời
                        </button>
                        {isMyComment && (
                          <button
                            className={styles.deleteBtn}
                            onClick={() => deleteComment(video.id, c.id)}
                          >
                            <Trash2 size={12} />
                            <span>Xóa</span>
                          </button>
                        )}
                      </div>

                      {/* Nested Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <div className={styles.repliesList}>
                          {c.replies.map(r => {
                            const rAuthor = getUserById(r.userId);
                            return (
                              <div key={r.id} className={styles.replyItem}>
                                <img src={rAuthor.avatar} alt={rAuthor.nickname} className={styles.rAvatar} />
                                <div className={styles.rBody}>
                                  <div className={styles.cTop}>
                                    <strong>{rAuthor.nickname}</strong>
                                    <span>{formatTimeAgo(r.createdAt)}</span>
                                  </div>
                                  <p className={styles.cText}>{r.text}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      className={`${styles.cLikeBtn} ${c.isLiked ? styles.activeHeart : ''}`}
                      onClick={() => toggleCommentLike(video.id, c.id)}
                    >
                      <Heart size={14} fill={c.isLiked ? 'var(--primary)' : 'none'} />
                      {c.likesCount > 0 && <span>{c.likesCount}</span>}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Emojis Bar */}
          <div className={styles.quickEmojisBar}>
            {quickEmojis.map(emoji => (
              <button
                key={emoji}
                type="button"
                className={styles.emojiPickBtn}
                onClick={() => setInputText(prev => prev + emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Banner */}
          {replyingTo && (
            <div className={styles.replyingBanner}>
              <div className={styles.replyingText}>
                <CornerDownRight size={13} />
                <span>Đang trả lời <strong>{getUserById(replyingTo.userId).nickname}</strong></span>
              </div>
              <button className={styles.cancelReplyBtn} onClick={() => setReplyingTo(null)}>Hủy</button>
            </div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <input
              type="text"
              placeholder={replyingTo ? `Trả lời ${getUserById(replyingTo.userId).nickname}...` : 'Thêm bình luận...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.commentInput}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={styles.commentPostBtn}
            >
              Đăng
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
