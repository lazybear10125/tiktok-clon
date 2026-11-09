import React from 'react';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAgo } from '../../utils/formatters';
import styles from './NotificationItem.module.css';

export default function NotificationItem({ notification }) {
  const { getUserById, markNotificationAsRead } = useApp();
  const author = getUserById(notification.userId);

  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart size={14} className={styles.likeIcon} fill="#FE2C55" color="#FE2C55" />;
      case 'comment':
        return <MessageCircle size={14} className={styles.commentIcon} fill="#20D5EC" color="#20D5EC" />;
      case 'follow':
        return <UserPlus size={14} className={styles.followIcon} />;
      default:
        return <AtSign size={14} className={styles.mentionIcon} />;
    }
  };

  return (
    <div
      className={`${styles.item} ${!notification.isRead ? styles.unread : ''}`}
      onClick={() => markNotificationAsRead(notification.id)}
    >
      <div className={styles.avatarWrapper}>
        <img src={author.avatar} alt={author.nickname} className={styles.avatar} />
        <div className={styles.typeBadge}>
          {getIcon()}
        </div>
      </div>

      <div className={styles.contentCol}>
        <div className={styles.titleText}>
          <strong>{author.nickname}</strong>{' '}
          <span>{notification.title.replace(author.nickname, '')}</span>
        </div>
        <span className={styles.timeText}>{formatTimeAgo(notification.createdAt)}</span>
      </div>

      {notification.previewImg && (
        <div className={styles.previewCol}>
          <img src={notification.previewImg} alt="video preview" className={styles.previewImg} />
        </div>
      )}

      {!notification.isRead && <span className={styles.unreadDot} />}
    </div>
  );
}
