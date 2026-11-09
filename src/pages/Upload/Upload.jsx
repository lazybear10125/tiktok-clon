import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Film,
  Music,
  Check,
  Hash,
  AtSign,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Upload.module.css';

export default function Upload() {
  const { addUploadedVideo, showToast } = useApp();
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('public'); // 'public' | 'friends' | 'private'
  const [allowComment, setAllowComment] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showToast('Vui lòng chọn file định dạng video (MP4, WebM...)');
        return;
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      showToast('Đã tải video vào khung xem trước!');
    }
  };

  const handleUseSample = () => {
    const sampleUrl = 'https://res.cloudinary.com/demo/video/upload/c_fill,ar_9:16,w_540/samples/cld-sample-video.mp4';
    setVideoPreviewUrl(sampleUrl);
    setCaption('Video đầu tiên được sáng tạo trên TikTok Clone! 🎉🚀 #fyp #viral #creator');
    showToast('Đã nạp video mẫu thành công!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoPreviewUrl) {
      showToast('Vui lòng tải lên một video hoặc sử dụng video mẫu');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addUploadedVideo({
        videoUrl: videoPreviewUrl,
        caption: caption || 'Video mới đăng tải #tiktok #creator',
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
        tags: ['tiktok', 'creator', 'viral'],
      });
      setIsSubmitting(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Tải video lên</h2>
          <p>Đăng video vào tài khoản của bạn</p>
        </div>

        <div className={styles.body}>
          {/* Left Column: Upload Dropzone / Preview */}
          <div className={styles.dropCol}>
            {videoPreviewUrl ? (
              <div className={styles.previewBox}>
                <video
                  src={videoPreviewUrl}
                  controls
                  loop
                  className={styles.previewVideo}
                />
                <button
                  className={styles.changeVideoBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Thay đổi video
                </button>
              </div>
            ) : (
              <div
                className={styles.dropzone}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className={styles.hiddenInput}
                />
                <div className={styles.dropIconBox}>
                  <UploadCloud size={40} className={styles.dropIcon} />
                </div>
                <h4 className={styles.dropTitle}>Chọn video để tải lên</h4>
                <p className={styles.dropSub}>Hoặc kéo và thả tập tin vào đây</p>

                <div className={styles.specsList}>
                  <p>• Định dạng MP4, WebM hoặc MOV</p>
                  <p>• Độ phân giải tối thiểu 720x1280</p>
                  <p>• Thời lượng tối đa 10 phút</p>
                  <p>• Kích thước nhỏ hơn 2GB</p>
                </div>

                <button
                  type="button"
                  className={styles.selectFileBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Chọn tập tin
                </button>

                <button
                  type="button"
                  className={styles.sampleVideoBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseSample();
                  }}
                >
                  Dùng video mẫu có sẵn
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Video Details Form */}
          <div className={styles.formCol}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Caption */}
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label>Chú thích</label>
                  <span className={styles.charCount}>{caption.length}/2200</span>
                </div>
                <div className={styles.captionWrapper}>
                  <textarea
                    rows={4}
                    placeholder="Thêm chú thích cho video của bạn..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={2200}
                    className={styles.captionInput}
                  />
                  <div className={styles.captionTools}>
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => setCaption(prev => prev + ' #fyp #trending')}
                    >
                      <Hash size={15} />
                      <span>Hashtag</span>
                    </button>
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => setCaption(prev => prev + ' @sontungmtp')}
                    >
                      <AtSign size={15} />
                      <span>Nhắc đến</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover */}
              <div className={styles.formGroup}>
                <label>Ảnh bìa</label>
                <div className={styles.coverSelector}>
                  <div className={`${styles.coverItem} ${styles.coverActive}`}>
                    <img
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80"
                      alt="Cover 1"
                    />
                  </div>
                  <div className={styles.coverItem}>
                    <img
                      src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&q=80"
                      alt="Cover 2"
                    />
                  </div>
                  <div className={styles.coverItem}>
                    <img
                      src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80"
                      alt="Cover 3"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className={styles.formGroup}>
                <label>Ai có thể xem video này</label>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="public">Công khai</option>
                  <option value="friends">Bạn bè</option>
                  <option value="private">Chỉ mình tôi</option>
                </select>
              </div>

              {/* Toggles */}
              <div className={styles.formGroup}>
                <label>Cho phép người dùng:</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={allowComment}
                      onChange={(e) => setAllowComment(e.target.checked)}
                    />
                    <span>Bình luận</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={allowDuet}
                      onChange={(e) => setAllowDuet(e.target.checked)}
                    />
                    <span>Duet</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={allowStitch}
                      onChange={(e) => setAllowStitch(e.target.checked)}
                    />
                    <span>Ghép nối (Stitch)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.btnRow}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => navigate('/')}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !videoPreviewUrl}
                  className={styles.postBtn}
                >
                  {isSubmitting ? 'Đang đăng...' : 'Đăng video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
