import React, { useState } from 'react';
import { CheckCheck, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import NotificationItem from '../../components/NotificationItem/NotificationItem';
import styles from './Notifications.module.css';

export default function Notifications() {
  const { notifications, markAllNotificationsAsRead } = useApp();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'like' | 'comment' | 'follow' | 'mention'

  const filteredList = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Thông báo</h1>
          <p className={styles.subTitle}>
            {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc hết các thông báo'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button className={styles.markReadBtn} onClick={markAllNotificationsAsRead}>
            <CheckCheck size={16} />
            <span>Đánh dấu đã đọc</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterBtn} ${filterType === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('all')}
        >
          Tất cả hoạt động
        </button>
        <button
          className={`${styles.filterBtn} ${filterType === 'like' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('like')}
        >
          Thích
        </button>
        <button
          className={`${styles.filterBtn} ${filterType === 'comment' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('comment')}
        >
          Bình luận
        </button>
        <button
          className={`${styles.filterBtn} ${filterType === 'follow' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('follow')}
        >
          Follower
        </button>
        <button
          className={`${styles.filterBtn} ${filterType === 'mention' ? styles.filterActive : ''}`}
          onClick={() => setFilterType('mention')}
        >
          Nhắc đến
        </button>
      </div>

      {/* List */}
      <div className={styles.list}>
        {filteredList.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={48} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Không có thông báo</h3>
            <p className={styles.emptyDesc}>Các tương tác mới sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <NotificationItem key={item.id} notification={item} />
          ))
        )}
      </div>
    </div>
  );
}
