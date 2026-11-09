import React, { useState } from 'react';
import { X, Heart, MessageCircle, Send, Smile, CornerDownRight, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumber, formatTimeAgo } from '../../utils/formatters';
import styles from './CommentPanel.module.css';

const quickEmojis = ['😂', '❤️', '🔥', '👏', '💯', '😍', '🥺', '🎉', '🚀', '✨'];

export default function CommentPanel({ videoId, onClose }) {
  const {
    currentUser,
    commentsMap,
    addComment,
    deleteComment,
    toggleCommentLike,
    getUserById,
    showToast,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const comments = commentsMap[videoId] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addComment(videoId, inputText, replyingTo ? replyingTo.id : null);
    setInputText('');
    setReplyingTo(null);
  };

  const totalCommentsCount = comments.reduce(
    (acc, curr) => acc + 1 + (curr.replies ? curr.replies.length : 0),
    0
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h3>Bình luận</h3>
          <span className={styles.countBadge}>({totalCommentsCount})</span>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close comments">
          <X size={20} />
        </button>
      </div>

      {/* Comment List */}
      <div className={styles.list}>
        {comments.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageCircle size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Chưa có bình luận nào</p>
            <span className={styles.emptySub}>Hãy là người đầu tiên bình luận về video này!</span>
          </div>
        ) : (
          comments.map((comment) => {
            const author = getUserById(comment.userId);
            const isMyComment = currentUser && currentUser.id === comment.userId;
            return (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.avatarCol}>
                  <img
                    src={author.avatar}
                    alt={author.nickname}
                    className={styles.commentAvatar}
                  />
                </div>

                <div className={styles.contentCol}>
                  <div className={styles.authorRow}>
                    <span className={styles.authorName}>{author.nickname}</span>
                    <span className={styles.timeAgo}>
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>

                  <p className={styles.commentText}>{comment.text}</p>

                  <div className={styles.actionsRow}>
                    <button
                      className={styles.replyBtn}
                      onClick={() => setReplyingTo(comment)}
                    >
                      Trả lời
                    </button>
                    {isMyComment && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteComment(videoId, comment.id)}
                      >
                        <Trash2 size={12} />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.repliesList}>
                      {comment.replies.map((reply) => {
                        const replyAuthor = getUserById(reply.userId);
                        const isMyReply = currentUser && currentUser.id === reply.userId;
                        return (
                          <div key={reply.id} className={styles.replyItem}>
                            <img
                              src={replyAuthor.avatar}
                              alt={replyAuthor.nickname}
                              className={styles.replyAvatar}
                            />
                            <div className={styles.replyContent}>
                              <div className={styles.authorRow}>
                                <span className={styles.authorName}>
                                  {replyAuthor.nickname}
                                </span>
                                <span className={styles.timeAgo}>
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className={styles.commentText}>{reply.text}</p>
                              {isMyReply && (
                                <button
                                  className={styles.deleteBtn}
                                  onClick={() => deleteComment(videoId, reply.id)}
                                >
                                  <Trash2 size={11} />
                                  <span>Xóa</span>
                                </button>
                              )}
                            </div>
                            <button
                              className={`${styles.likeBtn} ${reply.isLiked ? styles.liked : ''}`}
                              onClick={() => toggleCommentLike(videoId, reply.id)}
                            >
                              <Heart size={14} fill={reply.isLiked ? 'var(--primary)' : 'none'} />
                              {reply.likesCount > 0 && (
                                <span className={styles.likeCount}>
                                  {formatNumber(reply.likesCount)}
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Like Button */}
                <button
                  className={`${styles.likeBtn} ${comment.isLiked ? styles.liked : ''}`}
                  onClick={() => toggleCommentLike(videoId, comment.id)}
                  aria-label="Like comment"
                >
                  <Heart size={16} fill={comment.isLiked ? 'var(--primary)' : 'none'} />
                  {comment.likesCount > 0 && (
                    <span className={styles.likeCount}>
                      {formatNumber(comment.likesCount)}
                    </span>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Emojis Bar */}
      <div className={styles.emojiRow}>
        {quickEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={styles.emojiBtn}
            onClick={() => setInputText(prev => prev + emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Replying Notice Banner */}
      {replyingTo && (
        <div className={styles.replyingBanner}>
          <div className={styles.replyingText}>
            <CornerDownRight size={14} />
            <span>Đang trả lời <strong>{getUserById(replyingTo.userId).nickname}</strong></span>
          </div>
          <button
            className={styles.cancelReplyBtn}
            onClick={() => setReplyingTo(null)}
          >
            Hủy
          </button>
        </div>
      )}

      {/* Input Box Footer */}
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <img
          src={currentUser.avatar}
          alt={currentUser.nickname}
          className={styles.inputAvatar}
        />
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder={
              replyingTo
                ? `Trả lời ${getUserById(replyingTo.userId).nickname}...`
                : 'Thêm bình luận...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={styles.input}
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={styles.sendBtn}
          aria-label="Post comment"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
