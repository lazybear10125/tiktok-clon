import React, { useState } from 'react';
import { X, Camera, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './EditProfileModal.module.css';

const sampleAvatars = [
  '/avatars/sondn.jpg',
  '/avatars/sontungmtp.jpg',
  '/avatars/domixi.jpg',
  '/avatars/hieuthuhai.jpg',
  '/avatars/denvau.jpg',
  '/avatars/thuytien.jpg',
  '/avatars/lanngoc.jpg',
  '/avatars/duytham.jpg',
];

export default function EditProfileModal() {
  const { currentUser, isEditProfileOpen, closeEditProfile, updateCurrentUser } = useApp();

  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [website, setWebsite] = useState(currentUser?.website || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '/avatars/sondn.jpg');

  if (!isEditProfileOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCurrentUser({
      nickname: nickname.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
      website: website.trim(),
      avatar,
    });
    closeEditProfile();
  };

  return (
    <div className={styles.overlay} onClick={closeEditProfile}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Sửa hồ sơ</h3>
          <button className={styles.closeBtn} onClick={closeEditProfile}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Avatar Section */}
          <div className={styles.avatarSection}>
            <div className={styles.currentAvatarWrapper}>
              <img src={avatar} alt="Avatar" className={styles.currentAvatar} />
              <div className={styles.cameraOverlay}>
                <Camera size={20} color="#fff" />
              </div>
            </div>

            <div className={styles.avatarPickerList}>
              <p className={styles.pickerTitle}>Chọn avatar đại diện:</p>
              <div className={styles.avatarGrid}>
                {sampleAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.avatarChoiceBtn} ${avatar === url ? styles.activeChoice : ''}`}
                    onClick={() => setAvatar(url)}
                  >
                    <img src={url} alt="Choice" className={styles.choiceImg} />
                    {avatar === url && <div className={styles.checkBadge}><Check size={10} color="#fff" /></div>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Form Fields */}
          <div className={styles.fieldGroup}>
            <label>Tên người dùng (TikTok ID)</label>
            <div className={styles.inputPrefixWrapper}>
              <span className={styles.prefix}>www.tiktok.com/@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^\w.-]/g, ''))}
                className={styles.prefixInput}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Tên hiển thị</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={styles.textInput}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label>Tiểu sử</label>
              <span className={styles.counter}>{bio.length}/80</span>
            </div>
            <textarea
              rows={3}
              maxLength={80}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={styles.textareaInput}
              placeholder="Thêm tiểu sử giới thiệu về bản thân bạn..."
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Trang web cá nhân</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={styles.textInput}
              placeholder="https://..."
            />
          </div>

          {/* Footer Buttons */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={closeEditProfile}>
              Hủy
            </button>
            <button type="submit" className={styles.saveBtn}>
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
