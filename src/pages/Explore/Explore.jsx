import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Flame, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumber } from '../../utils/formatters';
import styles from './Explore.module.css';

const categories = [
  'Tất cả',
  'Âm nhạc',
  'Nhảy & Vũ đạo',
  'Thể thao',
  'Hài kịch',
  'Ẩm thực',
  'Công nghệ & Học hỏi',
  'Thời trang',
];

export default function Explore() {
  const { allVideos, getUserById } = useApp();
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  return (
    <div className={styles.container}>
      {/* Category Pills Header */}
      <div className={styles.categoryBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.categoryPill} ${activeCategory === cat ? styles.categoryActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'Tất cả' && <Sparkles size={14} className={styles.pillIcon} />}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Explore Grid of Videos */}
      <div className={styles.videoGrid}>
        {allVideos.map((video) => {
          const author = getUserById(video.userId);
          return (
            <div key={video.id} className={styles.card}>
              <Link to={`/@${author.username}`} className={styles.thumbnailWrapper}>
                <img src={video.coverUrl} alt={video.description} className={styles.thumbnail} />
                <div className={styles.overlay}>
                  <div className={styles.viewBadge}>
                    <Play size={12} fill="#fff" />
                    <span>{formatNumber(video.viewsCount)}</span>
                  </div>
                </div>
              </Link>

              <div className={styles.cardDetails}>
                <p className={styles.cardCaption}>{video.description}</p>
                <div className={styles.authorRow}>
                  <Link to={`/@${author.username}`} className={styles.authorInfo}>
                    <img src={author.avatar} alt={author.nickname} className={styles.avatar} />
                    <span className={styles.authorName}>{author.nickname}</span>
                  </Link>

                  <div className={styles.likeInfo}>
                    <Heart size={14} fill="#8A8B91" color="#8A8B91" />
                    <span>{formatNumber(video.likesCount)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
