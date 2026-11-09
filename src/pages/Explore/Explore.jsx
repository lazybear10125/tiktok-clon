import React, { useState } from 'react';
import { Play, Heart, Sparkles } from 'lucide-react';
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
  const { allVideos, getUserById, openVideoModal } = useApp();
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const filteredVideos = allVideos.filter(video => {
    if (activeCategory === 'Tất cả') return true;
    const desc = (video.description || '').toLowerCase();
    const tags = (video.tags || []).join(' ').toLowerCase();
    const text = `${desc} ${tags}`;

    switch (activeCategory) {
      case 'Âm nhạc':
        return text.includes('music') || text.includes('nhac') || text.includes('song') || text.includes('sontung') || text.includes('mytam') || text.includes('taylor') || text.includes('hieuthuhai');
      case 'Nhảy & Vũ đạo':
        return text.includes('dance') || text.includes('nhay') || text.includes('ciin') || text.includes('vudao');
      case 'Thể thao':
        return text.includes('football') || text.includes('ronaldo') || text.includes('messi') || text.includes('thethao') || text.includes('siuuu');
      case 'Hài kịch':
        return text.includes('khaby') || text.includes('humor') || text.includes('haihuoc') || text.includes('leduongbaolam') || text.includes('domixi');
      case 'Ẩm thực':
        return text.includes('nauan') || text.includes('an') || text.includes('food');
      case 'Công nghệ & Học hỏi':
        return text.includes('f8') || text.includes('laptrinh') || text.includes('tech') || text.includes('duytham') || text.includes('learn');
      case 'Thời trang':
        return text.includes('fashion') || text.includes('chaubui') || text.includes('ootd') || text.includes('thoitrang');
      default:
        return true;
    }
  });

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
        {filteredVideos.map((video) => {
          const author = getUserById(video.userId);
          return (
            <div
              key={video.id}
              className={styles.card}
              onClick={() => openVideoModal(video)}
            >
              <div className={styles.thumbnailWrapper}>
                <img src={video.coverUrl} alt={video.description} className={styles.thumbnail} />
                <div className={styles.overlay}>
                  <div className={styles.viewBadge}>
                    <Play size={12} fill="#fff" />
                    <span>{formatNumber(video.viewsCount)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardDetails}>
                <p className={styles.cardCaption}>{video.description}</p>
                <div className={styles.authorRow}>
                  <div className={styles.authorInfo}>
                    <img src={author.avatar} alt={author.nickname} className={styles.avatar} />
                    <span className={styles.authorName}>{author.nickname}</span>
                  </div>

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
